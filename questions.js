/**
 * AWS構成図クイズ - 問題データ
 * 作成者: Sekimoto Naoto
 * 作成日: 2026-04-24
 * 更新日: 2026-04-28
 * 説明: AWS構成図を見てユースケースを当てる逆引き形式クイズの問題データ（全90問）
 *       誤答を「同じ構成図のサービスを使った別解釈・よくある誤解」に統一し、
 *       熟考しないと選べない難度に改訂。
 */

const QUESTIONS = [
  // ============================================================
  // BASIC（問1〜10）: シンプルな2〜3サービス構成
  // ============================================================
  {
    id: 1,
    level: 'basic',
    diagram: `
[Route 53]
    ↓
[CloudFront]
    ↓
[S3 (Static Website)]
`,
    question: 'この構成図のユースケースとして最も適切なものはどれか？',
    choices: [
      'A. グローバルに配信される静的ウェブサイトのホスティング',
      'B. CloudFrontをAPIプロキシとして使い、S3に保存されたLambda関数コードを動的実行する構成',
      'C. Route 53のレイテンシールーティングでユーザーを最寄りのS3バケットに直接誘導し、CloudFrontはバイパスする構成',
      'D. CloudFrontのオリジンをS3に向けることで、S3バケットをプライベートのまま署名付きURLなしに認証制御する構成'
    ],
    answer: 'A',
    explanation: '【正解: A】Route 53でDNS解決 → CloudFrontでエッジキャッシュ配信 → S3から静的コンテンツを返す、という静的ウェブサイトホスティングの王道構成です。\n\n【Bが違う理由】CloudFrontはHTTPリクエストのプロキシ・キャッシュは行いますが、S3に置かれたコードを直接「実行」する機能はありません。Lambda@Edgeを使えば処理は可能ですが、この図にはLambdaが存在しません。\n\n【Cが違う理由】Route 53のレイテンシールーティングはリージョン単位の振り分けに使いますが、この構成ではCloudFrontがオリジンとしてS3にアクセスします。CloudFrontをバイパスする構成はこの図と一致しません。\n\n【Dが違う理由】CloudFrontのOAC（Origin Access Control）を使えばS3をプライベートに保ちつつ配信は可能ですが、「署名付きURLなしに認証制御する」という説明は不正確で、CloudFrontの署名付きURLやCookieが別途必要です。'
  },
  {
    id: 2,
    level: 'basic',
    diagram: `
[Client]
    ↓
[API Gateway (REST)]
    ↓
[Lambda]
    ↓
[DynamoDB]
`,
    question: 'この構成図のユースケースとして最も適切なものはどれか？',
    choices: [
      'A. API GatewayがリクエストをキャッシュしてLambdaの呼び出しを削減し、DynamoDBへの書き込みを非同期化する読み取り最適化API',
      'B. サーバーレスアーキテクチャによるCRUD APIの提供',
      'C. API GatewayのVPCリンク機能を介してDynamoDBにLambdaを経由せず直接アクセスする低レイテンシー構成',
      'D. LambdaがDynamoDBのストリームをポーリングし、変更イベントをAPI Gateway経由でクライアントにプッシュ通知するリアルタイム構成'
    ],
    answer: 'B',
    explanation: '【正解: B】Client → API Gateway → Lambda → DynamoDB という構成は、サーバーレスでCRUD操作を提供する典型的なAPIバックエンドです。インフラ管理不要・スケーラブルな構成として広く使われます。\n\n【Aが違う理由】API Gatewayにキャッシュ機能はありますが、それはあくまでGETリクエストのレスポンスキャッシュです。DynamoDBへの書き込みを非同期化する機能はこの構成には含まれておらず、図の矢印の流れとも一致しません。\n\n【Cが違う理由】API GatewayのVPCリンクはNLB経由でVPC内リソースに接続するものですが、DynamoDBはVPCリソースではなくAWSマネージドサービスであり、VPCリンクで直接つなぐ構成は成立しません。\n\n【Dが違う理由】DynamoDB Streamsをトリガーに使う構成は実在しますが、その場合の矢印の向きはDynamoDB → Lambda です。この図ではClientからの下り方向の処理を示しており、ストリームによるイベント駆動とは逆向きの構成です。'
  },
  {
    id: 3,
    level: 'basic',
    diagram: `
[Client]
    ↓
[EC2 (Web/App Server)]
    ↓
[RDS (MySQL / PostgreSQL)]
`,
    question: 'この構成図のユースケースとして最も適切なものはどれか？',
    choices: [
      'A. EC2上のアプリケーションがRDSのリードレプリカのみに接続し、書き込みはDMS経由でオンプレミスDBに送る構成',
      'B. RDSをセッションストアとして使い、EC2がステートレスなAPIサーバーとして水平スケールする構成',
      'C. モノリシックなWebアプリケーションの基本構成',
      'D. EC2をバッチサーバーとして使い、RDSに蓄積されたデータを定期的に集計・加工する分析基盤'
    ],
    answer: 'C',
    explanation: '【正解: C】Client → EC2（Web/Appサーバー） → RDS という構成は、Webサーバーとアプリケーションロジックを1台のEC2にまとめ、RDSをデータ永続化に使うモノリシックWebアプリの典型例です。\n\n【Aが違う理由】RDSのリードレプリカやDMSはこの図に登場しません。オンプレミスとの連携を示す要素が構成図に存在しない以上、この選択肢は図の読み取りとして誤りです。\n\n【Bが違う理由】RDSをセッションストアとして使いEC2がステートレスに動くケースは実在しますが、その場合は通常ELBを介した複数EC2構成になります。図にはEC2が1台のみ描かれており、水平スケールを前提とした構成の説明としては不一致です。\n\n【Dが違う理由】EC2 + RDSでバッチ処理を行うこと自体は可能ですが、図にはClientからEC2への矢印があり、クライアントがリクエストを送るWeb/Appサーバーの役割を示しています。バッチサーバーとしての用途と図の構造が一致しません。'
  },
  {
    id: 4,
    level: 'basic',
    diagram: `
[Publisher]
    ↓
[SNS Topic]
  ↓     ↓
[SQS Queue A]  [SQS Queue B]
    ↓                ↓
[Lambda A]      [Lambda B]
`,
    question: 'この構成図のユースケースとして最も適切なものはどれか？',
    choices: [
      'A. SNS TopicがSQSキューのデッドレターキューとして機能し、処理失敗メッセージをLambdaで再試行する耐障害性構成',
      'B. 1つのイベントを複数のサービスに並行配信するファンアウト処理',
      'C. SQS Queue AとBがFIFOキューとして順序を保証し、Lambda AとBが依存関係を持ちながら逐次処理する構成',
      'D. PublisherがSNS Topicをサブスクライブし、LambdaからのレスポンスをSQS経由で受け取るリクエスト・レスポンス型の非同期API'
    ],
    answer: 'B',
    explanation: '【正解: B】Publisher → SNS Topic → 複数SQSキュー → 複数Lambdaというファンアウトパターンは、1つのイベントを複数の独立したサブスクライバーに並行配信する代表的な構成です。\n\n【Aが違う理由】SNSはデッドレターキュー（DLQ）の役割を果たしません。DLQはSQSやLambdaが失敗時にメッセージを送る先として設定するものであり、SNS TopicがDLQとして機能する構成は存在しません。\n\n【Cが違う理由】FIFOキューで順序を保証すること自体は可能ですが、それはSQSの設定の話であり、この図の構成がファンアウト（並行配信）を示していることとは相反します。「Lambda AとBが依存関係を持つ逐次処理」はこの図の並列構造と矛盾します。\n\n【Dが違う理由】PublisherはSNS TopicにPublish（送信）する側であり、Topicをサブスクライブする側ではありません。また、図の矢印はPublisher→SNS→SQS→Lambdaという一方向の流れを示しており、LambdaからPublisherへの戻りは存在しません。'
  },
  {
    id: 5,
    level: 'basic',
    diagram: `
[User]
  ↓ (ファイルアップロード)
[S3 Bucket]
  ↓ (PutObjectイベント)
[Lambda]
`,
    question: 'この構成図のユースケースとして最も適切なものはどれか？',
    choices: [
      'A. LambdaがS3をポーリングしてファイルの変更を検知し、処理キューに積むプル型のバッチ処理',
      'B. S3のPutObjectイベントをLambdaが受け取り、処理結果を同じS3バケットの同一パスに上書き保存する構成',
      'C. ユーザーがファイルをアップロードするたびにLambdaが同期的にレスポンスを返すリアルタイムファイル変換API',
      'D. S3へのファイルアップロードをトリガーとするイベント駆動処理'
    ],
    answer: 'D',
    explanation: '【正解: D】ユーザーがS3にファイルをアップロードすると、PutObjectイベントがトリガーとなりLambdaが自動起動するイベント駆動の構成です。画像リサイズ・ファイル変換・メタデータ抽出など幅広い用途で使われます。\n\n【Aが違う理由】S3はLambdaにイベントをプッシュします。LambdaがS3をポーリングする仕組みは存在しません（DynamoDB StreamsやSQSはポーリングですが、S3は異なります）。図の矢印もS3→Lambdaの方向を示しており、プル型の説明とは逆です。\n\n【Bが違う理由】処理結果を同一バケットの同一パスに上書き保存すると、再度PutObjectイベントが発生してLambdaが再トリガーされる無限ループが発生します。実際の設計では出力先を別バケットまたは別プレフィックスに分けることが必須であり、この選択肢は危険なアンチパターンです。\n\n【Cが違う理由】S3のPutObjectイベントはLambdaを非同期で起動します。ユーザーへの同期レスポンスを返す仕組みはこの構成に含まれていません。リアルタイムAPIとして使うには別途API Gatewayなどが必要です。'
  },
  {
    id: 6,
    level: 'basic',
    diagram: `
[CloudWatch Alarm]
    ↓ (アラート発火)
[SNS Topic]
    ↓
[Lambda]
  ↓       ↓
[Slack通知] [自動復旧処理]
`,
    question: 'この構成図のユースケースとして最も適切なものはどれか？',
    choices: [
      'A. CloudWatchがEC2のCPU使用率を監視し、アラート発火時にSNS経由でLambdaを呼び出してEC2インスタンスを自動スケールアウトする構成',
      'B. CloudWatchアラートをトリガーとした障害通知・自動対応',
      'C. SNS TopicがLambdaとSlackの両方をサブスクライブし、LambdaはSlack通知の送信のみを担う単純な中継構成',
      'D. CloudWatchアラームが閾値を超えた際にLambdaが直接Slackに通知し、SNSは別系統の通知チャンネルとして並行動作する構成'
    ],
    answer: 'B',
    explanation: '【正解: B】CloudWatch Alarm → SNS Topic → Lambda という流れで、Lambdaがアラート内容に応じてSlack通知と自動復旧処理を実行する、障害対応の自動化構成です。\n\n【Aが違う理由】EC2のスケールアウトはAuto Scalingポリシーで行うのが一般的であり、Lambdaが直接EC2を起動することも技術的には可能ですが、この図の構成の核心は「Slack通知 + 自動復旧処理」の両立であり、スケールアウト専用の説明では不十分です。\n\n【Cが違う理由】図ではLambdaが「Slack通知」と「自動復旧処理」の両方を行うことが明示されています。「LambdaはSlack通知の送信のみ」という説明は自動復旧処理の部分を無視しており、図の読み取りとして不正確です。\n\n【Dが違う理由】図ではCloudWatch → SNS → Lambdaという一本の経路が描かれており、LambdaがSNSを経由せず直接Slackに通知したり、SNSが別系統で動いたりする構成は図と一致しません。'
  },
  {
    id: 7,
    level: 'basic',
    diagram: `
[Client]
    ↓ (ログイン/トークン取得)
[Cognito User Pool]
    ↓ (JWT検証)
[API Gateway]
    ↓
[Lambda]
`,
    question: 'この構成のアクセス制御の仕組みとして、最も正確な説明はどれか？',
    choices: [
      'A. API Gatewayはリクエストのたびにcognito-idp APIを呼び出してトークンの有効性をリアルタイム検証する',
      'B. LambdaがCognito User Poolに直接問い合わせてユーザー属性を確認し、アクセス可否を自ら判断する',
      'C. API GatewayはCognitoが発行したJWTの署名・有効期限をローカルで検証し、正当なリクエストのみLambdaに転送する',
      'D. CognitoがリクエストごとにLambdaの実行IAMロールを切り替え、ユーザーごとにAWSリソースへのアクセス権限を制御する'
    ],
    answer: 'C',
    explanation: '【正解: C】API GatewayのCognitoオーソライザーはJWTの署名と有効期限をローカルで検証する。Cognitoへの都度問い合わせは不要で、高速かつスケーラブルに機能する。\n\n【Aが違う理由】API Gatewayはローカルでの署名検証のためCognitoへのリアルタイム問い合わせは行わない。その結果、トークン失効の即時反映が難しいというトレードオフがある。\n\n【Bが違う理由】アクセス制御の責務はAPI Gatewayオーソライザーにある。LambdaがUser Poolを直接参照してアクセス判断する設計は責務が混在し、セキュリティリスクになる。\n\n【Dが違う理由】IAMロールの動的付与はCognito Identity Pool（フェデレーテッドID）の機能。User Poolはエンドユーザー認証が目的であり、AWSリソースへの権限付与は行わない。'
  },
  {
    id: 8,
    level: 'basic',
    diagram: `
[Producer (EC2 / Lambda)]
    ↓
[SQS Queue]
    ↓ (メッセージポーリング)
[Lambda Consumer]
`,
    question: 'この構成図のユースケースとして最も適切なものはどれか？',
    choices: [
      'A. ProducerがSQSにメッセージを送信すると同時にLambdaが同期的にトリガーされ、処理結果をProducerに即時返却するリクエスト・レスポンス型構成',
      'B. Lambda ConsumerがSQSのメッセージを1件処理するたびにSQSが次のメッセージを自動的にプッシュする、プッシュ型のリアルタイム配信構成',
      'C. SQSのFIFOキューによってProducerの送信順序が厳密に保証され、Lambda Consumerが同一メッセージを重複なく正確に1回だけ処理することが保証される構成',
      'D. 処理速度の異なるシステム間をキューで繋ぐ非同期処理'
    ],
    answer: 'D',
    explanation: '【正解: D】Producer → SQS → Lambda Consumerという構成は、送信側と処理側の速度差をキューで吸収する非同期処理の典型です。ProducerはSQSにメッセージを入れるだけで処理完了を待たず、Lambda Consumerが自分のペースで処理します。\n\n【Aが違う理由】SQSはメッセージを一時的に保持するキューであり、ProducerがSQSにメッセージを送信した瞬間にLambdaが同期的にトリガーされる仕組みはありません。LambdaはSQSをポーリングして非同期に起動します。\n\n【Bが違う理由】LambdaとSQSの連携はLambdaがSQSをポーリングする「プル型」です。SQSがLambdaにメッセージをプッシュする仕組みは存在しません。図にも「メッセージポーリング」と明記されています。\n\n【Cが違う理由】SQS FIFOキューは順序保証と重複排除を提供しますが、この図がFIFOキューであるとは明示されていません。また、Lambdaの冪等性はアプリケーション側で担保する必要があり、SQSが自動保証するわけではありません。'
  },
  {
    id: 9,
    level: 'basic',
    diagram: `
[EventBridge (Scheduler)]
    ↓ (毎日 AM 2:00 など)
[Lambda]
    ↓
[処理結果をS3/DynamoDB等に保存]
`,
    question: 'この構成図のユースケースとして最も適切なものはどれか？',
    choices: [
      'A. EventBridge Schedulerが複数のLambdaを依存関係に従って順次呼び出し、ワークフロー全体の進捗をDynamoDBで管理するオーケストレーション構成',
      'B. Lambdaがタイムアウトした場合にEventBridgeが自動的に再トリガーし、処理結果をS3に冪等に保存するリトライ構成',
      'C. EventBridgeがLambdaの実行ログをS3/DynamoDBに定期的にエクスポートするログアーカイブ構成',
      'D. Cronライクなスケジュール実行による定期バッチ処理'
    ],
    answer: 'D',
    explanation: '【正解: D】EventBridge Schedulerのcron/rate式でLambdaを定期起動し、処理結果をS3やDynamoDBに保存する構成は、夜間バッチ・定期レポート生成・データ集計などに使われます。\n\n【Aが違う理由】複数Lambdaの依存関係管理やオーケストレーションにはAWS Step Functionsを使うのが適切です。EventBridge Schedulerは単一の宛先を指定してトリガーするものであり、ワークフロー全体の進捗管理機能はありません。\n\n【Bが違う理由】EventBridgeにはLambdaのタイムアウトを検知して自動再トリガーする機能はありません。Lambdaのリトライ制御はLambda側の設定で管理します。EventBridgeはあくまでスケジュールに基づいてトリガーを送るだけです。\n\n【Cが違う理由】CloudWatch LogsのS3エクスポートはCloudWatch Logs自身のエクスポート機能やKinesis Firehoseで行うものです。EventBridgeがLambdaの実行ログを直接S3にエクスポートする構成は存在しません。'
  },
  {
    id: 10,
    level: 'basic',
    diagram: `
[Route 53 (DNSフェイルオーバー)]
    ↓
[ELB (Application Load Balancer)]
  ↓         ↓         ↓
[EC2-1]  [EC2-2]  [EC2-3]
(複数AZ に分散配置)
`,
    question: 'この構成図のユースケースとして最も適切なものはどれか？',
    choices: [
      'A. Route 53のDNSフェイルオーバーがELBをプライマリ・セカンダリに振り分け、障害時にEC2ではなくS3の静的ページにフォールバックする静的フォールバック構成',
      'B. ELBがEC2インスタンスごとにスティッキーセッションを有効化し、同一ユーザーのリクエストを常に同一EC2に固定することでRDSへの負荷を軽減する構成',
      'C. 複数AZへのトラフィック分散と冗長化による高可用性Webシステム',
      'D. Route 53の加重ルーティングでEC2-1に80%、EC2-2に15%、EC2-3に5%のトラフィックを割り当て、新バージョンのカナリアリリースを行う構成'
    ],
    answer: 'C',
    explanation: '【正解: C】Route 53のDNSフェイルオーバー + ELB（ALB）によるトラフィック分散 + 複数AZへのEC2配置という構成は、単一障害点を排除し高可用性を実現するWebシステムの定石です。\n\n【Aが違う理由】Route 53のフェイルオーバールーティングでS3静的ページをセカンダリとして設定すること自体は実在するパターンですが、図にはS3が存在しません。図に描かれていないリソースを前提とした解釈は誤りです。\n\n【Bが違う理由】ELBのスティッキーセッションは実在する機能ですが、RDSへの負荷軽減を目的とするものではありません。この説明は機能の目的を誤って解釈しており、構成の主目的である高可用性・冗長化の説明としては不適切です。\n\n【Dが違う理由】加重ルーティングによるカナリアリリースはRoute 53の機能として存在しますが、それはDNSレベルの振り分けです。ELBが存在するこの構成ではELBがトラフィック分散を担っており、Route 53の役割はDNSフェイルオーバーです。'
  },

  // ============================================================
  // INTERMEDIATE（問11〜22）: 4〜6サービス・典型パターン
  // ============================================================
  {
    id: 11,
    level: 'intermediate',
    diagram: `
[Client]
    ↓
[ALB (Application Load Balancer)]
    ↓
[ECS Fargate (Webアプリ)]
  ↓               ↓
[RDS (Aurora)]  [ElastiCache (Redis)]
`,
    question: 'この構成図のユースケースとして最も適切なものはどれか？',
    choices: [
      'A. セッション管理とDBキャッシュを備えたコンテナWebアプリの本番運用',
      'B. ElastiCacheをメインDBとして使い、Auroraはバックアップ専用に割り当てたキャッシュファースト構成',
      'C. ECS FargateがAuroraに直接書き込み、ElastiCacheはALBのセッションアフィニティ制御のみに使う構成',
      'D. ALBのターゲットグループをElastiCacheに向け、RedisをHTTPレスポンスキャッシュとして直接公開する構成'
    ],
    answer: 'A',
    explanation: '【正解: A】ALB→ECS Fargate（Webアプリ）→Aurora（永続化）＋ElastiCache（Redisによるセッション・クエリキャッシュ）という組み合わせは、コンテナWebアプリの典型的な本番構成です。\n\n【Bが違う理由】ElastiCacheはインメモリキャッシュであり、耐久性を持たないため永続的なメインDBには使えません。Auroraをバックアップ専用に格下げする設計は、この構成の意図と逆です。\n\n【Cが違う理由】ElastiCacheはセッションデータやクエリ結果のキャッシュに使われます。ALBのセッションアフィニティ（スティッキーセッション）はALB自体の機能であり、ElastiCacheとは独立しています。\n\n【Dが違う理由】ALBはHTTPターゲットとしてElastiCacheを直接指定できません。ElastiCacheはアプリケーション層（ECS）からアクセスするものであり、ALBのターゲットにはなれません。'
  },
  {
    id: 12,
    level: 'intermediate',
    diagram: `
[User]
  ↓ (画像アップロード)
[S3 (元画像)]
  ↓ (S3イベント)
[Lambda]
  ↓         ↓
[Rekognition] →  分析結果
                    ↓
              [DynamoDB (ラベル保存)]
`,
    question: 'この構成図のユースケースとして最も適切なものはどれか？',
    choices: [
      'A. S3へのアップロードをトリガーにした画像自動分析・タグ付けパイプライン',
      'B. LambdaがRekognitionの分析結果をS3に上書き保存し、DynamoDBは変更履歴のバージョン管理に使う構成',
      'C. S3イベントをトリガーにLambdaがRekognitionで分析し、結果をS3の元画像メタデータとして付与する構成',
      'D. Rekognitionが直接S3をポーリングして画像を検出し、LambdaはDynamoDBへの書き込み専用に使う構成'
    ],
    answer: 'A',
    explanation: '【正解: A】S3アップロード→S3イベント→Lambda→Rekognition→DynamoDB（ラベル保存）という流れは、画像のアップロードを起点に自動でAI分析しタグをDBに保存するパイプラインです。\n\n【Bが違う理由】分析結果はDynamoDBに保存されています。結果をS3に上書きする設計ではなく、DynamoDBをバージョン管理に使うことも構成図から読み取れません。\n\n【Cが違う理由】S3オブジェクトメタデータへの付与もあり得る設計ですが、この構成図ではDynamoDBへの保存が明示されており、S3メタデータへの書き戻しは示されていません。\n\n【Dが違う理由】RekognitionはS3をポーリングする機能を持ちません。S3イベント→Lambdaという起動経路が正しく、RekognitionはLambdaから呼び出されるサービスです。'
  },
  {
    id: 13,
    level: 'intermediate',
    diagram: `
[Client]
    ↓
[API Gateway]
    ↓ (即座に202 Accepted返却)
[SQS Queue]
    ↓ (非同期で処理)
[Lambda]
    ↓
[DynamoDB]
`,
    question: 'この構成図のユースケースとして最も適切なものはどれか？',
    choices: [
      'A. レスポンスを即時返却し、重い処理を非同期で行うAPIパターン',
      'B. API Gatewayが202を返した後、SQSのFIFOキューがLambdaを順序保証付きで同期呼び出しする構成',
      'C. SQSがデッドレターキューとして機能し、Lambdaの失敗時に自動でAPI Gatewayへ再送する構成',
      'D. Lambdaがレスポンス完了後にSQSへメッセージを送り、API Gatewayはその結果をポーリングして返す構成'
    ],
    answer: 'A',
    explanation: '【正解: A】API Gatewayが即座に202 Acceptedを返し、SQSにメッセージを積んでLambdaが非同期処理するパターンは、重い処理をクライアントの待機なしに実行する非同期APIの典型です。\n\n【Bが違う理由】SQSのFIFOキューを使っても、LambdaはSQSからのポーリングで非同期に起動されます。「SQSがLambdaを同期呼び出しする」という動作はSQSの仕様上ありません。\n\n【Cが違う理由】デッドレターキューはLambdaの処理失敗時に使われますが、API Gatewayへの再送という動作はありません。デッドレターキューはあくまでメッセージの退避場所です。\n\n【Dが違う理由】この構成ではSQSはAPI Gatewayの下流にあります。LambdaがSQSへ送り、API Gatewayがポーリングするという逆向きの流れは構成図と一致しません。'
  },
  {
    id: 14,
    level: 'intermediate',
    diagram: `
[Internet]
    ↓
[CloudFront]
    ↓
[WAF (Web Application Firewall)]
    ↓
[ALB]
    ↓
[EC2 (Webアプリ)]
`,
    question: 'この構成図のユースケースとして最も適切なものはどれか？',
    choices: [
      'A. SQLインジェクション・XSSなどの攻撃を防御するセキュアなWebアプリ',
      'B. CloudFrontがWAFルールを評価し、正常リクエストのみALBに転送するが、EC2への直接アクセスはWAFをバイパスできる構成',
      'C. WAFをALBにアタッチすることでCloudFrontをバイパスした直接攻撃も防御でき、CloudFrontはキャッシュ専用として機能する構成',
      'D. CloudFrontのオリジンをEC2に直接向けることで、ALBとWAFを経由せずに静的コンテンツを高速配信する構成'
    ],
    answer: 'A',
    explanation: '【正解: A】CloudFront→WAF→ALB→EC2という多層防御構成により、エッジでのWAFフィルタリングによってSQLインジェクションやXSSなどの攻撃を防ぎながらWebアプリを安全に提供します。\n\n【Bが違う理由】EC2へのセキュリティグループ設定でCloudFrontやALB以外からの直接アクセスをブロックするのが正しい設計です。「EC2への直接アクセスがバイパスできる」という説明は、構成図が意図するセキュリティ設計の不完全な理解です。\n\n【Cが違う理由】WAFをALBにアタッチする構成も有効ですが、この図ではWAFはCloudFrontの前段に配置されています。ALBに付けた場合、エッジでの遮断は失われます。\n\n【Dが違う理由】CloudFrontのオリジンをEC2に直接向けた場合、ALBとWAFが介在しないため攻撃防御層が失われます。構成図はALBとWAFを経由する設計になっています。'
  },
  {
    id: 15,
    level: 'intermediate',
    diagram: `
[データ生成元 (アプリ/センサー)]
    ↓
[Kinesis Data Streams]
    ↓
[Lambda (リアルタイム変換)]
    ↓
[S3 (データレイク)]
    ↓
[Athena (SQLクエリ)]
`,
    question: 'この構成図のユースケースとして最も適切なものはどれか？',
    choices: [
      'A. ストリームデータをリアルタイム変換しS3に蓄積して分析するパイプライン',
      'B. KinesisがLambdaをリアルタイム起動して加工結果をS3に保存し、AthenaはS3のデータを直接更新・書き換えするクエリに使う構成',
      'C. Lambdaがデータを変換してS3に保存した後、Athenaがリアルタイムにストリームを監視してクエリを自動実行する構成',
      'D. S3をステージングエリアとして使い、Athenaがデータをポーリングしてリアルタイムダッシュボードに秒単位で反映する構成'
    ],
    answer: 'A',
    explanation: '【正解: A】Kinesis Data Streams→Lambda（変換）→S3（蓄積）→Athena（分析）は、ストリームデータをリアルタイム変換しながらS3に貯め、後でアドホック分析する典型的なデータパイプラインです。\n\n【Bが違う理由】AthenaはS3上のデータに対してSQLでクエリを実行しますが、データを「更新・書き換え」する機能はありません。Athenaは読み取り専用のクエリエンジンです。\n\n【Cが違う理由】AthenaはS3のストリームをリアルタイム監視する機能を持ちません。クエリは手動またはスケジュール実行であり、イベント駆動での自動実行はAthena単体ではできません。\n\n【Dが違う理由】Athenaはサーバーレスなアドホッククエリサービスであり、秒単位のリアルタイムダッシュボードには不向きです。それにはKinesis Data AnalyticsやOpenSearch等が適しています。'
  },
  {
    id: 16,
    level: 'intermediate',
    diagram: `
[Trigger (API Gateway / EventBridge)]
    ↓
[Step Functions (ステートマシン)]
  ↓       ↓        ↓
[Lambda A] [Lambda B] [Lambda C]
(入力検証)  (処理)    (通知)
    ↓
[DynamoDB (状態保存)]
`,
    question: 'この構成図のユースケースとして最も適切なものはどれか？',
    choices: [
      'A. 複数のLambda関数を順序付きで実行する複雑なワークフロー処理',
      'B. Step FunctionsがLambda A→B→Cを並列実行し、どれか1つが完了した時点でDynamoDBに成功状態を書き込む構成',
      'C. Lambda Aが失敗した場合、Step Functionsが自動でLambda Cをスキップし、Lambda Bにフォールバックして処理を継続する構成',
      'D. EventBridgeが定期的にStep Functionsを起動し、Lambda A・B・CがDynamoDBへ競合なく同時書き込みできるよう調停する構成'
    ],
    answer: 'A',
    explanation: '【正解: A】Step Functionsのステートマシンは複数のLambda関数を順序・条件・エラーハンドリングつきで管理するオーケストレーションサービスです。Lambda A（検証）→B（処理）→C（通知）という流れが典型的なワークフローです。\n\n【Bが違う理由】並列実行自体はStep Functionsで可能ですが、「どれか1つが完了した時点で成功とみなす」はRaceパターンであり、図の構成（A→B→Cの順序処理）とは異なります。\n\n【Cが違う理由】Step FunctionsはCatch/Retryによるエラーハンドリングが可能ですが、「失敗時にCをスキップしてBにフォールバック」という動作は、構成図の順序（A→B→C）と矛盾します。\n\n【Dが違う理由】DynamoDBはトランザクション機能を持ちますが、Step Functionsが「複数Lambdaの同時書き込みを調停する」という役割は持ちません。Step Functionsの役割はワークフローの制御であり、DB書き込みの調停ではありません。'
  },
  {
    id: 17,
    level: 'intermediate',
    diagram: `
[注文サービス (Publisher)]
    ↓
[SNS Topic (注文イベント)]
  ↓           ↓           ↓
[SQS A]     [SQS B]     [SQS C]
(在庫更新)  (メール送信) (分析記録)
    ↓           ↓           ↓
[Lambda A]  [Lambda B]  [Lambda C]
`,
    question: 'この構成図のユースケースとして最も適切なものはどれか？',
    choices: [
      'A. ECサイトの注文確定をトリガーに複数サービスが独立処理するマイクロサービス連携',
      'B. SNS TopicがSQS A・B・Cに同じメッセージを届けるが、Lambda A・B・Cは同一の処理を冗長実行して結果を多数決で確定する構成',
      'C. 注文サービスが直接Lambda A・B・Cを呼び出し、SQSは各Lambdaの処理結果を集約してSNSに通知するための応答キューとして機能する構成',
      'D. SQS A・B・Cのいずれかが処理失敗した場合、SNS TopicがDead Letter Topicとして機能し、注文サービスへ失敗イベントを再送する構成'
    ],
    answer: 'A',
    explanation: '【正解: A】SNS TopicへのPublishにより複数のSQSキューへファンアウトし、それぞれ独立したLambdaが在庫更新・メール送信・分析記録を担うパターンは、マイクロサービス間の疎結合連携の典型です。\n\n【Bが違う理由】SNSのファンアウトは各サブスクライバーが独立した処理をするためのものであり、同一処理を冗長実行して多数決で確定するという用途ではありません。\n\n【Cが違う理由】この構成では注文サービスはSNS Topicにのみ送信し、Lambda A・B・Cを直接呼び出しません。SQSは応答キューではなく、各Lambdaのトリガー兼バッファです。\n\n【Dが違う理由】SNS TopicはDead Letter Topicとして機能しません。SQSのデッドレターキューは処理失敗メッセージを退避する別のキューです。SNSへの再送という動作もSQSの標準機能にはありません。'
  },
  {
    id: 18,
    level: 'intermediate',
    diagram: `
[データソース (S3 / RDS等)]
    ↓
[Glue ETL (データ変換・クレンジング)]
    ↓
[S3 (変換後データ)]
    ↓
[Athena (アドホッククエリ)]
    ↓
[QuickSight (BIダッシュボード)]
`,
    question: 'この構成図のユースケースとして最も適切なものはどれか？',
    choices: [
      'A. サーバーレスなデータETLとBIダッシュボードによるデータ分析基盤',
      'B. GlueがS3とRDSを結合してリアルタイムにデータを変換し、QuickSightがAthenaを介さずGlueに直接接続してダッシュボードを更新する構成',
      'C. AthenaがS3上の変換前データに直接クエリし、GlueはQuickSightへのデータ転送前処理としてのみ機能する構成',
      'D. GlueのETL結果をRDSに書き戻し、AthenaがRDSをクエリ対象としてQuickSightにデータを渡す構成'
    ],
    answer: 'A',
    explanation: '【正解: A】データソース→Glue ETL（変換・クレンジング）→S3（変換後データ）→Athena（SQLクエリ）→QuickSight（ダッシュボード）という流れは、サーバーレスなデータ分析基盤の代表的な構成です。\n\n【Bが違う理由】GlueはバッチETLツールであり、リアルタイム変換には不向きです。またQuickSightはGlueに直接接続する機能を持たず、S3やAthena経由でデータを取得します。\n\n【Cが違う理由】この構成ではAthenaはGlue変換後のS3データをクエリします。変換前のデータに直接クエリすることも技術的には可能ですが、GlueのETL目的と矛盾し、構成図の流れとも異なります。\n\n【Dが違う理由】AthenaはRDSを直接クエリ対象にできません。AthenaはS3上のデータに対してクエリするサービスです。GlueのETL結果をRDSに書き戻す構成自体は可能ですが、この構成図の示す流れではありません。'
  },
  {
    id: 19,
    level: 'intermediate',
    diagram: `
[GitHub / CodeCommit (コードPush)]
    ↓
[CodePipeline]
    ↓
[CodeBuild (ビルド・テスト)]
    ↓
[ECR (コンテナイメージ登録)]
    ↓
[ECS (新バージョンデプロイ)]
`,
    question: 'この構成図のユースケースとして最も適切なものはどれか？',
    choices: [
      'A. コードプッシュからコンテナデプロイまでを自動化するCI/CDパイプライン',
      'B. CodeBuildがビルドとテストを同時並列実行し、ECRへの登録はテストとビルドの両方が成功した場合のみCodePipelineが承認する構成',
      'C. ECRに登録されたコンテナイメージをCodePipelineが直接ECSに展開し、CodeBuildはビルドのみ担当してテストはECS上の本番環境で実施する構成',
      'D. CodeCommitへのPushをトリガーにCodePipelineが起動するが、ECRへの登録前に手動承認ステージが必須となっている構成'
    ],
    answer: 'A',
    explanation: '【正解: A】GitHub/CodeCommit→CodePipeline→CodeBuild（ビルド・テスト）→ECR（イメージ登録）→ECS（デプロイ）は、コンテナアプリのCI/CDパイプラインの標準的な構成です。\n\n【Bが違う理由】CodeBuildはビルドとテストを1つのビルドプロジェクト内で実行するのが一般的です。「並列実行で両方成功した場合のみ承認」という動作はCodePipelineの並列アクションで実現できますが、構成図にその明示はなく、標準的な解釈とは異なります。\n\n【Cが違う理由】本番ECS上でテストを実施するのはリスクが高く、一般的なCI/CDの原則に反します。CodeBuildがビルドとテストの両方を担い、問題がなければECRに登録するのが正しい流れです。\n\n【Dが違う理由】手動承認ステージはCodePipelineで追加可能ですが、構成図には記載されていません。構成図の示す流れはPushから自動でデプロイまで完結するパイプラインです。'
  },
  {
    id: 20,
    level: 'intermediate',
    diagram: `
[オンプレミスデータセンター]
    ↓ (専用線 1Gbps以上)
[Direct Connect]
    ↓
[Virtual Private Gateway]
    ↓
[VPC (プライベートサブネット)]
  ↓           ↓
[EC2]        [RDS]
`,
    question: 'この構成図のユースケースとして最も適切なものはどれか？',
    choices: [
      'A. 安定した高帯域幅でオンプレミスとAWSを繋ぐハイブリッドクラウド構成',
      'B. Direct ConnectがVirtual Private Gatewayを介さずVPCに直接接続し、EC2とRDSはパブリックサブネットに配置してオンプレミスからアクセスする構成',
      'C. VPNとDirect Connectを併用することで冗長化し、Direct Connect障害時にVPNへ自動フェイルオーバーする構成',
      'D. Direct ConnectをTransit Gatewayに接続して複数VPCへルーティングし、各VPCのEC2とRDSに同時アクセスする構成'
    ],
    answer: 'A',
    explanation: '【正解: A】オンプレミス→Direct Connect（専用線）→Virtual Private Gateway→VPC（プライベートサブネット）→EC2＋RDSという構成は、安定した専用帯域でオンプレミスとAWSを繋ぐハイブリッドクラウドの典型です。\n\n【Bが違う理由】Direct ConnectはVirtual Private Gatewayを経由してVPCに接続するのが標準です。またEC2とRDSをパブリックサブネットに置くことはセキュリティ上の問題があり、構成図も「プライベートサブネット」と明示しています。\n\n【Cが違う理由】VPN冗長化構成は実際に推奨されるパターンですが、この構成図にはVPNの記載がありません。構成図から読み取れる接続方式はDirect Connect単独です。\n\n【Dが違う理由】Transit Gatewayを使った複数VPCへのルーティングは有効な構成ですが、この構成図にTransit Gatewayは登場しません。図ではVirtual Private Gatewayが単一VPCへの接続点として使われています。'
  },
  {
    id: 21,
    level: 'intermediate',
    diagram: `
[Client A] ←→ [API Gateway (WebSocket API)] ←→ [Client B]
                    ↓ (接続/切断/メッセージ)
                [Lambda]
                    ↓
              [DynamoDB (接続ID管理)]
`,
    question: 'この構成図のユースケースとして最も適切なものはどれか？',
    choices: [
      'A. HTTP Pollingにより、クライアントが定期的にAPI Gatewayに問い合わせてDynamoDBの最新接続IDを取得しメッセージを確認する構成',
      'B. WebSocketを使ったリアルタイム双方向通信チャットシステム',
      'C. API GatewayのWebSocket APIがクライアントの接続を受け付けた後、Lambdaが接続IDをDynamoDBに保存し、以降のメッセージ送信はLambdaを介さずAPI Gatewayが直接ルーティングする構成',
      'D. DynamoDBのStreamsがLambdaをトリガーし、LambdaがAPI Gatewayを通じて接続中クライアントへメッセージをプッシュ配信する構成'
    ],
    answer: 'B',
    explanation: '【正解: B】API GatewayのWebSocket APIを使い、接続IDをDynamoDBで管理することでクライアント間のリアルタイム双方向通信を実現するのがこの構成の本質です。チャットシステムの典型実装です。\n\n【Aが違う理由】HTTP Pollingは接続を維持せず定期的にリクエストを送る方式です。この構成図はWebSocket APIを使っており、接続を張り続けてサーバーからプッシュできる点が根本的に異なります。\n\n【Cが違う理由】WebSocket APIでのメッセージ送信はLambdaを介して処理されます。「以降のメッセージ送信でLambdaを介さない」という動作はこの構成では正確ではなく、Lambdaがルーティングロジックを担います。\n\n【Dが違う理由】DynamoDB Streamsを使ってLambdaをトリガーするパターンも技術的には可能ですが、この構成図にDynamoDB Streamsの記載はありません。DynamoDBは接続ID管理用であり、ストリーム起点の設計ではありません。'
  },
  {
    id: 22,
    level: 'intermediate',
    diagram: `
[外部からのメール送信]
    ↓
[SES (メール受信)]
    ↓ (S3アクション)
[S3 (メール本文保存)]
    ↓ (S3イベント)
[Lambda (メール解析・処理)]
`,
    question: 'この構成図のユースケースとして最も適切なものはどれか？',
    choices: [
      'A. 受信メールを自動解析してワークフローを起動するメール処理システム',
      'B. Lambdaがメールを解析した結果をSESのバウンス処理機能に渡し、不達メールをS3に自動アーカイブする構成',
      'C. SESがS3に保存した受信メールをLambdaが解析し、解析結果を再びSESを通じてSMTPで転送・返信する構成',
      'D. S3イベントがLambdaをトリガーするが、LambdaはメールをSESのテンプレート形式に変換してDynamoDBに格納する構成'
    ],
    answer: 'A',
    explanation: '【正解: A】外部メール→SES（受信）→S3（メール本文保存）→S3イベント→Lambda（解析・処理）という流れは、受信メールをトリガーに自動ワークフローを起動するメール処理システムです。\n\n【Bが違う理由】SESのバウンス処理はメール送信時の不達通知に関する機能であり、受信メールの解析結果をバウンス処理に渡すという動作は構成図の意図と異なります。\n\n【Cが違う理由】LambdaがSESを呼び出してメールを転送・返信するパターンは技術的に可能ですが、この構成図にはその経路が示されていません。構成図の流れはSES→S3→Lambdaで完結しており、LambdaからSESへの逆向きの矢印はありません。\n\n【Dが違う理由】LambdaがSESのテンプレート形式に変換してDynamoDBに格納するという動作は構成図に示されていません。この構成図のLambdaの役割は「メール解析・処理」であり、DynamoDBへの書き込みも図には登場しません。'
  },

  // ============================================================
  // ADVANCED（問23〜30）: 大規模・複雑な構成
  // ============================================================
  {
    id: 23,
    level: 'advanced',
    diagram: `
[Internet]
    ↓
[CloudFront (グローバルCDN)]
    ↓
[ALB]
    ↓
[EKS (Kubernetes クラスター)]
  ↓         ↓            ↓
[Pod群]   [Pod群]      [Pod群]
    ↓         ↓            ↓
[RDS Aurora] [ElastiCache] [OpenSearch]
(マスター/RR)  (Redis)      (全文検索)
`,
    question: 'この構成図のユースケースとして最も適切なものはどれか？',
    choices: [
      'A. CloudFrontとALBでHTTPSを終端し、EKS Podがステートレスに処理することで、RDS Auroraへの書き込みを排除してElastiCacheだけでデータを永続化するシステム',
      'B. 検索・キャッシュ・DBを備えた大規模Webシステムのコンテナ運用',
      'C. EKS PodがElastiCacheをプライマリDBとして使用し、OpenSearchはAuroraへの書き込みキューとして機能する非同期処理基盤',
      'D. CloudFrontがオリジンとしてALBとOpenSearchの両方を直接参照し、Podを経由せずに全文検索結果をエッジキャッシュする構成'
    ],
    answer: 'B',
    explanation: '【正解: B】CloudFront→ALB→EKS Podという多層構成に、RDS Aurora（永続DB）・ElastiCache（キャッシュ）・OpenSearch（全文検索）の3つのデータストアを組み合わせた構成は、大規模WebシステムのコンテナベースPlatformの典型パターンです。\n\n【Aが違う理由】ElastiCacheはインメモリキャッシュであり永続ストレージではありません。RDS Auroraが構成図に明示されており、書き込みを排除するという解釈は構成図と矛盾します。\n\n【Cが違う理由】ElastiCacheはRedisベースのキャッシュ層であり、プライマリDBとして使用する設計ではありません。またOpenSearchはドキュメント検索エンジンであり、書き込みキューの役割はSQSやKinesisが担います。\n\n【Dが違う理由】CloudFrontはALBをオリジンとして参照し、ALBがPodへルーティングします。CloudFrontがOpenSearchを直接オリジンとして参照する構成ではなく、全文検索はPod経由で行われます。'
  },
  {
    id: 24,
    level: 'advanced',
    diagram: `
[データソース (アプリ/ログ等)]
    ↓
[Kinesis Data Firehose]
    ↓
[S3 (rawデータ)]
    ↓
[Lambda (データ変換・Firehose経由)]
    ↓
[Redshift (DWH)]
    ↓
[QuickSight (BI・可視化)]
`,
    question: 'この構成図のユースケースとして最も適切なものはどれか？',
    choices: [
      'A. Kinesis FirehoseがS3に書き込む前にLambdaでリアルタイム変換し、変換済みデータをRedshiftではなくS3 Select経由でQuickSightが直接クエリするサーバーレス分析基盤',
      'B. ストリームデータを変換・蓄積してBIで分析するデータウェアハウス基盤',
      'C. LambdaがFirehoseのバッファリング間隔に関係なく即時にRedshiftへINSERTし、QuickSightはリアルタイムSPICEキャッシュなしでRedshiftを直接クエリする構成',
      'D. データソースからFirehoseで受け取ったrawデータをS3に保存した後、LambdaではなくGlue ETLジョブが変換を担い、Redshiftのスペクトルでクエリすることでデータ移動を最小化する設計'
    ],
    answer: 'B',
    explanation: '【正解: B】Kinesis Firehoseでストリームデータを受信→S3にraw保存→Lambdaで変換→Redshiftにロード→QuickSightで可視化という流れは、ストリーミングデータをBIで分析するDWH基盤の典型構成です。\n\n【Aが違う理由】構成図にはRedshiftが明示されており、QuickSightがS3 Select経由で直接クエリする構成とは異なります。「Redshiftではなく」という前提が構成図と矛盾します。\n\n【Cが違う理由】FirehoseはバッファリングしてS3に書き込む設計であり、LambdaがFirehoseのバッファを無視して即時Redshiftへ書き込む動作はFirehoseの仕組みと一致しません。\n\n【Dが違う理由】構成図では変換はLambdaが担っており、GlueもRedshift Spectrumも登場しません。正しい構成要素を使いながら役割を入れ替えた誤った解釈です。'
  },
  {
    id: 25,
    level: 'advanced',
    diagram: `
[拠点A (オンプレ)]     [拠点B (オンプレ)]
      ↓ Direct Connect   ↓ Site-to-Site VPN
[Transit Gateway]
  ↓         ↓         ↓
[VPC A]   [VPC B]   [VPC C]
(本番)    (開発)     (共有)
`,
    question: 'この構成図のユースケースとして最も適切なものはどれか？',
    choices: [
      'A. 複数VPC・オンプレ拠点をTransit Gatewayでハブアンドスポーク接続するネットワーク構成',
      'B. Direct ConnectとSite-to-Site VPNをTransit Gatewayに集約し、VPC間はピアリングではなくTransit Gateway経由でフルメッシュ接続を実現する高可用ネットワーク設計',
      'C. 拠点AはDirect Connectで低レイテンシ接続し、拠点BはSite-to-Site VPNをプライマリ経路として使用するが、Transit GatewayはVPC間ではなく拠点間のルーティングのみを担う構成',
      'D. Transit GatewayをAWS側のハブとして使用しつつ、本番・開発・共有の各VPCはそれぞれ独立したInternet Gatewayを持ち、オンプレとの通信のみTransit Gateway経由にセグメント化した設計'
    ],
    answer: 'A',
    explanation: '【正解: A】Transit Gatewayをハブとして、Direct Connect（拠点A）・Site-to-Site VPN（拠点B）・複数VPC（本番/開発/共有）をスポークとして接続するハブアンドスポーク型ネットワーク構成です。\n\n【Bが違う理由】VPC間通信はTransit Gateway経由で行われますが、これは「フルメッシュ」ではなくハブアンドスポーク型です。フルメッシュはVPCピアリングの形態であり、Transit Gatewayの利点はその管理を不要にすることです。\n\n【Cが違う理由】Transit GatewayはVPC間のルーティングも担います。「拠点間のルーティングのみ」という限定的な解釈は誤りです。\n\n【Dが違う理由】構成図にはInternet Gatewayの記載はなく、オンプレ接続に特化した構成として読むべきです。Transit Gatewayの役割を「オンプレとの通信のみ」に限定する解釈は誤りです。'
  },
  {
    id: 26,
    level: 'advanced',
    diagram: `
[EventBridge (外部イベント / スケジュール)]
    ↓
[Step Functions (エラーハンドリング付きワークフロー)]
  ↓ 成功              ↓ 失敗
[Lambda群]          [SNS (エラー通知)]
    ↓                    ↓
[SQS]              [SQS (DLQ: デッドレターキュー)]
    ↓
[Lambda (後続処理)]
`,
    question: 'この構成図のユースケースとして最も適切なものはどれか？',
    choices: [
      'A. 失敗したメッセージをDLQに退避する信頼性の高いイベント駆動ワークフロー',
      'B. Step FunctionsのエラーハンドリングがDLQへの退避を直接制御するが、SNSは通知のみに使用されるため、DLQ内のメッセージの再処理トリガーはEventBridgeが担う設計',
      'C. EventBridgeのルールに合致したイベントはStep Functionsを経由せず直接Lambda群へ並列ディスパッチされ、Step Functionsは失敗時のDLQ管理とSNS通知のみを担う構成',
      'D. SQSがLambda後続処理のトリガーとなるが、DLQへの退避はStep FunctionsのエラーハンドリングではなくSQSの可視性タイムアウト超過によって自動的に行われる設計'
    ],
    answer: 'A',
    explanation: '【正解: A】EventBridgeがトリガーとなりStep Functionsがオーケストレーションを担い、成功時はLambda→SQS→Lambda後続処理へ、失敗時はSNSで通知しDLQに退避する、信頼性の高いイベント駆動ワークフローです。\n\n【Bが違う理由】DLQ内メッセージの再処理トリガーをEventBridgeが担うという記述は構成図に根拠がありません。また「Step FunctionsがDLQへの退避を直接制御する」という表現も、実際にはSNS→DLQという流れを正確に表していません。\n\n【Cが違う理由】構成図ではEventBridgeはStep Functionsをトリガーしており、Lambda群へ直接ディスパッチする構成ではありません。Step Functionsがオーケストレーションの中心です。\n\n【Dが違う理由】DLQへの退避はStep Functionsのエラーハンドリング（Catch/Retry）によって制御されており、SQSの可視性タイムアウト超過による自動退避とは異なるメカニズムです。'
  },
  {
    id: 27,
    level: 'advanced',
    diagram: `
[S3バケット (機密データ)]
    ↓ (継続的スキャン)
[Macie (機密情報検出)]
    ↓ (検出結果)
[Security Hub (セキュリティ集約)]
    ↓
[EventBridge (ルール評価)]
  ↓               ↓
[Lambda          [SNS
 (自動隔離)]      (セキュリティ担当者へ通知)]
`,
    question: 'この構成図のユースケースとして最も適切なものはどれか？',
    choices: [
      'A. S3内の機密情報漏洩を自動検知して通知・隔離するセキュリティ監視システム',
      'B. MacieがS3をスキャンしてFindings（検出結果）をSecurity Hubに送信するが、EventBridgeはLambdaのみをトリガーし、SNSへの通知はLambdaが担ってセキュリティ担当者へ直接連絡する構成',
      'C. Security Hubがすべての検出結果を集約してEventBridgeにルーティングするが、自動隔離はLambdaではなくSecurity Hubのカスタムアクションによって直接実行される設計',
      'D. MacieによるS3スキャンは定期実行ではなくEventBridgeのスケジュールが起動するオンデマンド方式であり、Security HubはFindings集約ではなくLambdaの実行ログ監査のみを担う構成'
    ],
    answer: 'A',
    explanation: '【正解: A】MacieがS3を継続スキャン→Security HubにFindings集約→EventBridgeがルール評価→Lambdaで自動隔離＋SNSでセキュリティ担当者へ通知という、機密情報漏洩の自動検知・対応システムです。\n\n【Bが違う理由】構成図ではEventBridgeはLambdaとSNSの両方をトリガーしています。「SNSへの通知はLambdaが担う」という解釈は構成図と異なります。EventBridgeが直接SNSをターゲットとして呼び出す構成です。\n\n【Cが違う理由】Security Hubのカスタムアクションは隔離処理を直接実行する機能ではありません。自動隔離はEventBridgeがLambdaをトリガーすることで実現されます。Security Hubはあくまで集約・可視化の役割です。\n\n【Dが違う理由】MacieはS3バケットを継続的にスキャンする設計であり（構成図にも「継続的スキャン」と明記）、EventBridgeがオンデマンドでスキャンを起動する構成ではありません。またSecurity Hubの役割はFindings集約であり、Lambda実行ログ監査ではありません。'
  },
  {
    id: 28,
    level: 'advanced',
    diagram: `
[リージョンA (us-east-1)]           [リージョンB (ap-northeast-1)]
[Aurora Primary (書き込み)] ←→ [Aurora Secondary (読み取り)]
         ↓ フェイルオーバー検知
[Route 53 ヘルスチェック]
         ↓ DNS切り替え
[CloudFront (両リージョンのALBをオリジン)]
`,
    question: 'この構成図のユースケースとして最も適切なものはどれか？',
    choices: [
      'A. Route 53のヘルスチェックでリージョンAの障害を検知してDNSをリージョンBに切り替えるが、AuroraのSecondaryはフェイルオーバー後も読み取り専用のままで、書き込みはアプリケーション側での手動昇格が必要な設計',
      'B. 複数リージョンにまたがるAuroraのグローバルフェイルオーバーによる高可用性システム',
      'C. CloudFrontが両リージョンのALBをオリジンとしてアクティブ-アクティブで同時参照するため、Aurora Primary/Secondaryへの書き込みが両リージョンで同時発生し、競合はAurora Globalのレプリケーション機能で吸収される構成',
      'D. フェイルオーバー検知はRoute 53ヘルスチェックではなくAurora Global Databaseの自動フェイルオーバー機能が主体であり、Route 53はDNS切り替えではなくCloudFrontのオリジン選択のルーティングポリシーとしてのみ機能する設計'
    ],
    answer: 'B',
    explanation: '【正解: B】リージョンAにAurora Primary（書き込み）、リージョンBにAurora Secondary（読み取り）を配置し、Route 53ヘルスチェックで障害を検知してDNS切り替えを行い、CloudFrontが両リージョンのALBをオリジンとして高可用性を実現するAurora Global Databaseの典型構成です。\n\n【Aが違う理由】Aurora Global Databaseのフェイルオーバーでは、SecondaryリージョンのAuroraをPromote（昇格）させることで新たなPrimaryとして書き込みが可能になります。「手動昇格が必要」という記述は誤りであり、マネージドなフェイルオーバーが実現されます。\n\n【Cが違う理由】Aurora GlobalはリージョンAへの書き込みをリージョンBへ非同期レプリケーションする設計であり、両リージョンへの同時書き込みは想定されていません。アクティブ-アクティブな書き込みはAuroraの設計原則と一致しません。\n\n【Dが違う理由】Route 53ヘルスチェックはフェイルオーバー検知の重要な役割を担っており、「CloudFrontのオリジン選択のみ」という限定的な解釈は誤りです。Aurora Global Databaseの自動フェイルオーバーとRoute 53のDNS切り替えは補完的に機能します。'
  },
  {
    id: 29,
    level: 'advanced',
    diagram: `
[開発者 (コードPush)]
    ↓
[CodePipeline]
    ↓
[CodeBuild (テスト・ビルド)]
    ↓
[CodeDeploy (ECS Blue/Green デプロイ)]
  ↓ (新バージョン = Green)  ↓ (旧バージョン = Blue)
[ALB ターゲットグループ Green]  [ALB ターゲットグループ Blue]
    ↓ (検証OK後 100%切り替え)
[RDS Multi-AZ (同期レプリカ)]
`,
    question: 'この構成図のユースケースとして最も適切なものはどれか？',
    choices: [
      'A. ダウンタイムなしで新旧バージョンを並行稼働しながら安全にデプロイするCI/CD構成',
      'B. CodeDeployがECSのBlue/Greenデプロイを管理するが、ALBターゲットグループの切り替えはCodePipelineの承認アクションが必要であり、100%切り替え前にCodeBuildが自動E2Eテストを再実行してからトラフィックを移行する設計',
      'C. RDS Multi-AZはBlue環境のみに接続され、Greenへの切り替え完了後にRDSのエンドポイントもCodeDeployが自動的に書き換えるため、Blue/Green切り替えとDBフェイルオーバーが同時に行われる構成',
      'D. Blue/Greenデプロイ中はALBが両ターゲットグループに重み付きルーティング（例: Green 10%→50%→100%）でトラフィックを段階的に移行するカナリアリリース方式であり、CodeDeployは切り替え比率の制御のみを担う設計'
    ],
    answer: 'A',
    explanation: '【正解: A】CodePipeline→CodeBuild（テスト・ビルド）→CodeDeploy（ECS Blue/Greenデプロイ）という流れで、ALBのターゲットグループをBlue/Greenで並行稼働させ、検証後に100%切り替えることでダウンタイムなしのデプロイを実現するCI/CD構成です。\n\n【Bが違う理由】構成図にはCodePipelineの承認アクションやCodeBuildの再実行は記載されていません。また「ALBターゲットグループの切り替えにCodePipelineの承認が必要」という記述はBlue/Greenデプロイの標準的な仕組みと一致しません。CodeDeployが切り替えを制御します。\n\n【Cが違う理由】RDS Multi-AZはBlue/Green切り替えとは独立したDB可用性の仕組みです。CodeDeployがRDSエンドポイントを書き換えたり、Blue/Green切り替えとDBフェイルオーバーが同時発生する設計ではありません。\n\n【Dが違う理由】構成図は「検証OK後100%切り替え」と明示されており、段階的な重み付きルーティングのカナリアリリース方式とは異なります。カナリアとBlue/Greenは別のデプロイ戦略です。'
  },
  {
    id: 30,
    level: 'advanced',
    diagram: `
[IoTデバイス群 (センサー)]
    ↓ (MQTT)
[IoT Core (デバイス管理・ルール)]
    ↓
[Kinesis Data Streams]
    ↓
[Lambda (データ変換・異常検知)]
  ↓                  ↓
[DynamoDB]          [S3 (長期保存)]
(最新値・アラート)
    ↓
[Timestream (時系列DB)]
    ↓
[Grafana (可視化ダッシュボード)]
`,
    question: 'この構成図のユースケースとして最も適切なものはどれか？',
    choices: [
      'A. 工場・スマートホームなどのIoTセンサーデータを収集・分析するIoTデータ基盤',
      'B. IoT CoreのルールエンジンがKinesisを経由せず直接LambdaとDynamoDBに書き込み、KinesisはS3への長期保存のバッファリングとTimestreamへのバルクロードのみを担う、低レイテンシ優先のIoT処理構成',
      'C. LambdaがKinesisからデータを受け取って異常検知を行い、正常データはTimestreamに、異常データはDynamoDBにアラートとして書き込むが、S3への保存はGrafanaがエクスポートするレポートデータのみに限定される設計',
      'D. IoT CoreがMQTTメッセージをKinesisに送信した後、LambdaはDynamoDBとS3への書き込みのみを担い、TimestreamへのデータロードはKinesis Data FirehoseがLambdaを経由せず直接実行するパイプライン構成'
    ],
    answer: 'A',
    explanation: '【正解: A】IoTデバイス群がMQTTでIoT Coreにデータ送信→Kinesis Data Streamsで大量データを受信→Lambdaで変換・異常検知→DynamoDB（最新値・アラート）＋S3（長期保存）→Timestream（時系列DB）→Grafana（可視化）という、IoTセンサーデータの収集・分析基盤の典型構成です。\n\n【Bが違う理由】構成図ではIoT CoreはKinesis Data Streamsを経由してLambdaへ接続されており、IoT CoreのルールエンジンがKinesisを経由せず直接LambdaやDynamoDBに書き込む構成ではありません。\n\n【Cが違う理由】構成図ではLambdaがDynamoDBとS3の両方への書き込みを担っており、「S3への保存はGrafanaのエクスポートのみ」という解釈は誤りです。またGrafanaはTimestreamのデータを可視化するツールであり、S3へのエクスポートを主な役割としません。\n\n【Dが違う理由】構成図ではTimestreamへのデータロードはLambdaが行う流れであり、Kinesis Data Firehoseは登場しません。KinesisはData Streams（ストリーミング処理）として使用されており、FirehoseとStreamsは異なるサービスです。'
  },

  // ============================================================
  // 問31〜50（追加：多角的パターン）
  // ============================================================

  // --- BASIC（問31〜35）---
  {
    id: 31,
    level: 'basic',
    diagram: `
[VPC内 EC2]
    ↓
[VPC Gateway Endpoint (S3)]
    ↓
[S3 Bucket (プライベート)]
`,
    question: 'この構成図のユースケースとして最も適切なものはどれか？',
    choices: [
      'A. VPC Gateway EndpointはS3専用のプライベートルートをルートテーブルに追加するが、VPC外のオンプレミスやDirect Connect環境からは同じエンドポイントを共有利用できる構成',
      'B. Gateway EndpointがEC2からS3へのリクエストをVPC内でプロキシするため、S3バケットはVPCのCIDRブロックをソースIPとして識別し、バケットポリシーでIP制限をかけられる構成',
      'C. VPC内EC2がインターネットを経由せずS3にプライベートアクセスする構成',
      'D. Gateway EndpointをVPCに作成するだけでS3バケットへのアクセスが自動的にプライベート経路に切り替わるため、S3バケットポリシーやEC2のIAMロール設定は不要になる構成'
    ],
    answer: 'C',
    explanation: '【正解: C】VPC Gateway EndpointはS3/DynamoDBへのプライベート経路を提供します。EC2からのS3アクセスがインターネットゲートウェイやNATゲートウェイを経由しなくなるため、セキュリティ向上と転送コスト削減が実現できます。\n\n【Aが違う理由】Gateway Endpointを設定すると、VPCルートテーブルにS3向けエントリが追加され、S3宛トラフィックは自動的にEndpointを経由します。インターネット経由の経路には戻りません。バケットポリシーはアクセス制御に使いますが、通信経路の変更には関係しません。\n\n【Bが違う理由】Gateway EndpointはS3とDynamoDB専用であり、すべてのAWSサービス宛トラフィックを処理するわけではありません。他のAWSサービスにはInterface Endpoint（PrivateLink）を使います。NATゲートウェイの完全な代替にはなりません。\n\n【Dが違う理由】Gateway EndpointにTLS終端やデータ復号の機能はありません。S3はHTTPSで通信を暗号化しており、Endpointはルーティングのみでデータ内容を操作しません。'
  },
  {
    id: 32,
    level: 'basic',
    diagram: `
[Application (EC2 / Lambda)]
    ↓
[DAX (DynamoDB Accelerator)]
    ↓
[DynamoDB]
`,
    question: 'この構成図のユースケースとして最も適切なものはどれか？',
    choices: [
      'A. DAXがWrite-Throughキャッシュとして機能するため、アプリがDAXに書き込むとDynamoDBとキャッシュが同時に更新され、書き込み後の読み取りでも常に最新データをマイクロ秒台で返せる構成',
      'B. DynamoDBの読み取り結果をDAXでインメモリキャッシュし、読み取りレイテンシをマイクロ秒台に短縮する構成',
      'C. アプリケーションがDAXを経由してDynamoDBに書き込むと、DAXがそのキャッシュエントリを即時無効化（キャッシュイン・イン方式）するため、結果整合性ではなく強い整合性の読み取りが保証される構成',
      'D. DAXはDynamoDBの前段に置かれ、読み取りはDAXが応答するためDynamoDBのRCUをほぼ消費しないが、DAX自体のノードスペックに関わらずDynamoDBのWCUはDAXのキャッシュヒット時にも通常通り消費される構成'
    ],
    answer: 'B',
    explanation: '【正解: B】DAX（DynamoDB Accelerator）はDynamoDBと互換のインメモリキャッシュです。読み取りレイテンシをミリ秒からマイクロ秒に短縮でき、DynamoDBの読み取りキャパシティの消費も削減できます。\n\n【Aが違う理由】DAXは書き込みスループットを増幅する機能はありません。書き込みはDAXを通過してDynamoDBに直接書き込まれます（Write-Through）。DynamoDBのWCU制限を超える書き込みはDAXでも処理できません。\n\n【Cが違う理由】DAXはDynamoDBからのイベント通知でキャッシュを無効化する仕組みではありません。書き込み時にDAX経由で書き込むことでキャッシュの整合性を保ちます。アプリケーションがDAXをバイパスしてDynamoDBに直接書き込むとキャッシュが古くなるリスクがあります。\n\n【Dが違う理由】DAXはキャッシュヒット時のRCU消費を削減しますが、キャッシュミス時はDynamoDBを読みに行くのでRCUが消費されます。また書き込みはDAXを経由してもDynamoDBのWCUを消費します。「RCU/WCUがゼロになる」は誤りです。'
  },
  {
    id: 33,
    level: 'basic',
    diagram: `
[Lambda Function A] ─┐
[Lambda Function B] ─┤→ [EFS (Elastic File System)]
[Lambda Function C] ─┘
`,
    question: 'この構成図のユースケースとして最も適切なものはどれか？',
    choices: [
      'A. Lambda関数のデプロイパッケージをEFSに保存することで、250MBのデプロイサイズ制限を回避し、複数のLambda関数が同じEFS上のライブラリを共有してコールドスタート時間を短縮する構成',
      'B. EFSをLambdaのエフェメラルストレージ（/tmp）の代替として使用することで、同一実行環境の複数の関数インスタンス間でデータを共有できるが、関数実行終了後にEFSのマウントポイントが自動的に解放される構成',
      'C. 複数のLambda関数が共有ファイルシステムを通じて大容量データや永続ファイルを読み書きする構成',
      'D. EFSがLambda関数間の共有メモリとして機能し、Function AがEFSに書き込んだデータをFunction BがメモリキャッシュとしてRAM展開することで、/tmpより高速なデータ共有を実現する構成'
    ],
    answer: 'C',
    explanation: '【正解: C】LambdaはEFSをマウントして共有ファイルシステムとして使えます。複数の関数が同じファイルを読み書きできるため、ML推論モデルの共有・大容量データ処理・関数間のデータ受け渡しなどに活用できます。\n\n【Aが違う理由】Lambdaのデプロイパッケージ（Zipやコンテナイメージ）はS3またはECRに保存されます。EFSにデプロイパッケージを配置してサイズ制限を回避する機能はありません。Lambda Layersで依存関係を分割するのが一般的な対処法です。\n\n【Bが違う理由】EFSの内容は関数実行後も永続されます。自動クリアされるのはLambdaのエフェメラルストレージ（/tmp、最大10GB）であり、EFSとは全く別物です。EFSはNFSプロトコルで接続する永続ストレージです。\n\n【Dが違う理由】Lambdaの実行ログはCloudWatch Logsに自動転送されます。EFSがログ収集をするためにLambdaと接続する構成は一般的ではありません。'
  },
  {
    id: 34,
    level: 'basic',
    diagram: `
[User (ブラウザ)]
    ↓ (未認証リクエスト)
[ALB]
    ↓ (Cognito User Pool へリダイレクト)
[Cognito User Pool (認証・ログイン画面)]
    ↓ (認証済みトークン)
[ALB → ターゲット (ECS / EC2)]
`,
    question: 'この構成図のユースケースとして最も適切なものはどれか？',
    choices: [
      'A. ALBのリスナールールがCognitoのJWTをヘッダーとして付与し、ターゲット（ECSやEC2）のアプリが受け取ったJWTを使って独自にユーザー検索・認証を行う構成',
      'B. Cognitoがユーザーのログイン完了後にALBに対してターゲットグループのルーティングルールを動的に変更し、ユーザーごとに異なるバックエンドへ振り分ける構成',
      'C. ALBがCognito User Poolに未認証リクエストをプロキシし、Cognito側でセッション管理・セッションCookieの発行を行ってALBのスティッキーセッション機能と組み合わせる構成',
      'D. ALBがCognito User Poolと連携し、アプリ側にコードを書かずにOIDCベースのログイン認証を実現する構成'
    ],
    answer: 'D',
    explanation: '【正解: D】ALBのCognito認証機能（組み込みOIDCオーソライザー）を使うと、アプリケーション側に認証コードを書かなくてもCognitoのログイン画面へのリダイレクト・トークン検証・セッション管理をALBが担います。\n\n【Aが違う理由】ALBはCognitoで認証されたユーザー情報をHTTPヘッダー（X-Amzn-Oidc-Data等）としてターゲットに転送しますが、ターゲットアプリが「独自にユーザー検索・認証を行う」のは設計の意図と逆です。このヘッダーはユーザー属性の参照には使えますが、再認証目的ではありません。\n\n【Bが違う理由】CognitoはALBのルーティングルールを動的に変更する機能を持ちません。ルーティングはALBのリスナールールで静的に設定します。ユーザー属性によるルーティングをしたい場合はLambda等を介した別の仕組みが必要です。\n\n【Cが違う理由】ALBのCognito統合では、セッション管理はALBが保持するセッションCookieで行われます。Cognito側でセッションを管理してALBのスティッキーセッションと組み合わせる構成ではなく、ALBが一元的にセッションを管理します。'
  },
  {
    id: 35,
    level: 'basic',
    diagram: `
[S3 Bucket]
    ↓ (30日後: Lifecycle Policy)
[S3 Standard-IA]
    ↓ (90日後: Lifecycle Policy)
[S3 Glacier Instant Retrieval]
    ↓ (365日後: Lifecycle Policy)
[S3 Glacier Deep Archive]
`,
    question: 'この構成図のユースケースとして最も適切なものはどれか？',
    choices: [
      'A. S3 Standard-IAへの移行は最低30日間のStandard保存が必要で、Glacier Instant RetrievalへはStandard-IAで最低30日間保存後に移行できるが、Glacier Deep Archiveへの直接移行は90日ルールが適用されるためこの構成では動作しない',
      'B. S3のライフサイクルポリシーでアクセス頻度に応じてストレージクラスを自動移行し、長期保存コストを最適化する構成',
      'C. Glacier Instant RetrievalはGlacier Deep Archiveへの移行前の中間ストレージとして機能し、数ミリ秒での取得が可能だが、Deep Archiveへ移行済みのオブジェクトを取得する場合はGlacier Instant Retrievalを経由して段階的に復元される構成',
      'D. ライフサイクルポリシーで移行したオブジェクトはS3の標準機能では元のストレージクラスへの自動ロールバックができないため、Glacier Deep Archiveに移行したオブジェクトをStandardに戻すにはCopyオペレーションで明示的に新しいオブジェクトを作成する必要がある構成'
    ],
    answer: 'B',
    explanation: '【正解: B】S3ライフサイクルポリシーを使うと、オブジェクトの経過日数に応じてStandard → Standard-IA → Glacier Instant Retrieval → Glacier Deep Archiveと自動移行できます。アクセス頻度の低いデータの保管コストを大幅に削減できる典型的なコスト最適化パターンです。\n\n【Aが違う理由】ライフサイクルポリシーの日数設定は厳密に適用されます。S3がアクセスパターンを自動分析して移行タイミングを変えることはありません。アクセスパターンに基づく自動階層化を使いたい場合はS3 Intelligent-Tieringを使います。\n\n【Cが違う理由】Glacier Deep Archiveへの移行後の取得にはS3 コンソールからリストアリクエストが必要であり、標準取得で12時間程度かかります。「即座に取得できる」のはGlacier Instant Retrievalの説明です。Deep Archiveは最も低コストかつ最も取得に時間がかかるクラスです。\n\n【Dが違う理由】Glacierに移行したオブジェクトはRestoreオペレーションで元のStandardクラスに一時コピーすることができます。「元のストレージクラスに戻せない」は誤りです。また、ライフサイクルポリシーは「不変ストレージ」を意味しません。オブジェクトロック（WORM）とは別の機能です。'
  },

  // --- INTERMEDIATE（問36〜45）---
  {
    id: 36,
    level: 'intermediate',
    diagram: `
[Client (モバイル / Webアプリ)]
    ↓ (GraphQL Query / Mutation / Subscription)
[AppSync (GraphQL API)]
    ↓ (Resolver)
[DynamoDB]
    ↓ (DynamoDB Streams)
[AppSync → クライアントへリアルタイムPush]
`,
    question: 'この構成図のユースケースとして最も適切なものはどれか？',
    choices: [
      'A. GraphQL APIでDynamoDBのデータをCRUD操作し、データ変更時にSubscriptionでクライアントへリアルタイム通知するアプリ基盤',
      'B. AppSyncのSubscriptionはDynamoDB Streamsから変更イベントを受け取るたびにResolverがMutationを自動生成し、クライアントへのPushはMQTT over WebSocketではなくGraphQL Mutationのレスポンスとして返される構成',
      'C. DynamoDBへの書き込みはAppSyncのMutationを経由せずSDKで直接行い、DynamoDB StreamsのイベントをAppSyncがキャプチャしてGraphQLのSubscriptionイベントに変換してクライアントへPushする構成',
      'D. AppSyncのSubscriptionはクライアントが最初に接続したWebSocketセッションを維持し続け、同じResolverを持つMutationが実行されるたびにDynamoDBへの書き込み結果をフィルタリングして該当するSubscriberにのみPushする構成'
    ],
    answer: 'A',
    explanation: '【正解: A】AppSyncはGraphQL APIを提供し、ResolverがDynamoDBとのCRUD操作を担います。DynamoDB Streamsと連携するとデータ変更時にSubscriptionを通じてWebSocket接続中のクライアントにリアルタイムでプッシュ通知できます。チャット・コラボレーションアプリに最適です。\n\n【Bが違う理由】AppSyncのResolverはDynamoDB StreamsをポーリングしてMutationを自動生成する機能はありません。また、AppSyncのSubscriptionはWebSocketベースであり、HTTPポーリングではありません。\n\n【Cが違う理由】DynamoDBへの書き込みをAppSyncを経由せず直接行うと、AppSyncのResolver経由での整合性制御ができなくなります。DynamoDB Streams経由でAppSyncに連携する構成も可能ですが、図の構成では書き込みはAppSync経由です。\n\n【Dが違う理由】AppSyncのSubscriptionは一度WebSocket接続を確立すれば、Query/Mutationのたびに新しい接続を作りません。継続的な接続を維持してサーバー側からPushします。接続IDをDynamoDBで管理するのはAPI Gateway WebSocket APIの構成であり、AppSyncとは異なる実装です。'
  },
  {
    id: 37,
    level: 'intermediate',
    diagram: `
[Lambda (大量同時実行)]
    ↓
[RDS Proxy (コネクションプーリング)]
    ↓
[RDS Aurora (MySQL / PostgreSQL)]
`,
    question: 'この構成図のユースケースとして最も適切なものはどれか？',
    choices: [
      'A. Lambdaの大量同時実行でRDSのコネクション数が枯渇しないよう、RDS ProxyがコネクションをプールしてRDSへの接続数を制御する構成',
      'B. RDS ProxyがLambdaとRDSの間でSQLクエリをキャッシュし、同一クエリに対してはRDSへのアクセスなしにProxyが直接レスポンスを返すことでRDSのCPU負荷を削減するクエリキャッシュ構成',
      'C. RDS ProxyがLambdaの各実行環境（コンテナ）とRDS間のコネクションを多重化（Multiplexing）するため、Lambdaの同時実行数が増えてもRDSへのコネクション数はLambda実行数と1対1で増加しない構成',
      'D. RDS ProxyがRDS Auroraのリーダーエンドポイントとライタープライマリエンドポイントを自動検出し、LambdaからのSQLの種類（SELECT/INSERT等）を解析してリードレプリカとプライマリに振り分けるRead/Writeスプリッティング構成'
    ],
    answer: 'A',
    explanation: '【正解: A】LambdaはスケールアウトするとRDSへの同時接続数が急増し、RDSのmax_connectionsを超えるリスクがあります。RDS ProxyがコネクションをプールしてLambdaからの大量接続を吸収し、RDSへの実際の接続数を少なく保ちます。\n\n【Bが違う理由】RDS ProxyはSQLクエリ結果をキャッシュする機能を持ちません。クエリキャッシュにはElastiCache（Redis/Memcached）やDAX（DynamoDB用）を使います。RDS Proxyはコネクションのプーリングのみを担います。\n\n【Cが違う理由】RDS Proxyの目的はコネクション数の削減です。Lambdaの実行環境ごとに専用DB接続を割り当てると、Proxyなしと同じ問題が起きます。Proxyは複数のLambdaコネクションを少数のDB接続に多重化します。\n\n【Dが違う理由】RDS ProxyはRead/Writeスプリッティング（リードレプリカへの自動振り分け）を行いません。この機能はAurora Cluster Endpointまたはアプリケーション側で実装します。RDS ProxyはコネクションプーリングとIAM認証・Secrets Manager連携が主な機能です。'
  },
  {
    id: 38,
    level: 'intermediate',
    diagram: `
[VPC / AWSアカウント全体]
    ↓ (継続的な脅威検知)
[GuardDuty]
    ↓ (Findings)
[EventBridge (ルール評価)]
  ↓               ↓
[Lambda           [SNS
 (自動遮断・修復)]  (セキュリティチームへ通知)]
`,
    question: 'この構成図のユースケースとして最も適切なものはどれか？',
    choices: [
      'A. GuardDutyが検出した脅威（不審なAPI呼び出し・マルウェア通信等）をEventBridge経由でLambdaが自動修復し、SNSでチームに通知するSOAR構成',
      'B. GuardDutyが検出したFindingsのうち重大度（Severity）が一定以上のものだけをEventBridgeがフィルタリングし、LambdaがIAM・Security Groupの変更による自動修復を行いつつ、同じFindingsをSNSでチームに通知する構成',
      'C. EventBridgeがGuardDutyのFindingsをS3に保存し、LambdaがそのS3イベントをトリガーに脅威を自動修復する一方、SNSはLambdaの実行完了通知としてセキュリティチームへアラートを送る構成',
      'D. LambdaがEventBridgeのスケジュールルールで定期的にGuardDutyのFindingsをポーリングしてSeverityを分類し、高リスクのFindingsのみEventBridgeのカスタムバスに転送してSNSに通知する構成'
    ],
    answer: 'A',
    explanation: '【正解: A】GuardDutyは機械学習ベースで脅威を継続検出し、Findingsを発行します。EventBridgeがFindingsのパターンに応じてルールを評価し、Lambdaで自動修復（不審なIAMキーの無効化・セキュリティグループの変更等）、SNSでセキュリティチームへ通知するSOAR（Security Orchestration, Automation and Response）パターンです。\n\n【Bが違う理由】GuardDutyはCloudTrailやVPCフローログを内部で分析しますが、EventBridgeのルールを動的に更新する機能はありません。EventBridgeのルールは別途手動またはIaCで設定します。\n\n【Cが違う理由】この説明は技術的には可能ですが、「SNSがLambdaの後続処理トリガーも兼ねる」という部分が図と一致しません。図ではEventBridgeがLambdaとSNSの両方を直接トリガーしており、SNSがLambdaをトリガーする流れは示されていません。\n\n【Dが違う理由】LambdaがGuardDutyのFindingsをポーリングする構成はありません。GuardDutyはFindingsをEventBridgeに自動的にプッシュします。またLambdaがEventBridgeを経由してGuardDutyの検出ルールを更新するという流れも、図の矢印の方向と逆です。'
  },
  {
    id: 39,
    level: 'intermediate',
    diagram: `
[User]
    ↓ (ソーシャルログイン / Cognito User Pool)
[Cognito Identity Pool]
    ↓ (STS: 一時クレデンシャル発行)
[IAM Role (ユーザー専用権限)]
    ↓
[S3 Bucket (ユーザーフォルダへのアクセス)]
`,
    question: 'この構成図のユースケースとして最も適切なものはどれか？',
    choices: [
      'A. Cognito Identity Poolが一時的なAWSクレデンシャルをユーザーに発行し、各ユーザーが自分のS3フォルダのみに直接アクセスできるモバイルアプリの構成',
      'B. Cognito Identity PoolがUser Poolの認証結果を受けてS3バケットポリシーを動的に書き換え、ユーザーごとに異なるアクセス権限をバケットポリシーで制御する構成',
      'C. STSが発行する一時クレデンシャルのデフォルト有効期限は1時間で、期限切れ後もアプリが同じクレデンシャルを使い続けるとS3アクセスが失敗するため、Cognito SDKが自動的にIdentity Poolへ再リクエストしてクレデンシャルを更新するRefresh処理が必要な構成',
      'D. IAM Roleのポリシー内で${cognito-identity.amazonaws.com:sub}変数を使ってS3のプレフィックスを動的に制限することで、同一のIAM Roleを全ユーザーで共有しながら各ユーザーが自分のフォルダのみアクセスできる構成'
    ],
    answer: 'A',
    explanation: '【正解: A】Cognito Identity Poolはソーシャルログインや自社IdPで認証されたユーザーに対して、STSを通じて一時的なAWSクレデンシャルを発行します。IAMポリシーに${cognito-identity.amazonaws.com:sub}などの変数を使うことで、各ユーザーが自分専用のS3パスにのみアクセスできる細かい権限制御が実現できます。\n\n【Bが違う理由】Cognito Identity PoolはS3バケットポリシーを動的に書き換えません。権限制御はIAMロールのポリシーにCognito IDの変数を組み込む形で実現します。バケットポリシーは静的な設定として管理されます。\n\n【Cが違う理由】STSの一時クレデンシャルはアプリ側（AWS SDKなど）が自動的に更新する仕組みを持っています。LambdaがS3にクレデンシャルを保存してユーザーに配布するのは重大なセキュリティリスクであり、このパターンは推奨されません。\n\n【Dが違う理由】IAM Roleはアクセス権限を定義するものであり、ユーザーの認証状態をS3のメタデータとして記録する機能はありません。セッション管理はCognito Identity Poolが担い、アクセスログはCloudTrailが記録します。'
  },
  {
    id: 40,
    level: 'intermediate',
    diagram: `
[User (グローバル)]
    ↓
[CloudFront (エッジロケーション)]
    ↓ (Viewer Request / Origin Request)
[Lambda@Edge]
    ↓ (変換・認証・リダイレクト後)
[Origin (S3 / ALB)]
`,
    question: 'この構成図のユースケースとして最も適切なものはどれか？',
    choices: [
      'A. エッジロケーションでリクエスト/レスポンスを操作（URL書き換え・認証・A/Bテスト等）するサーバーレスエッジ処理構成',
      'B. Lambda@EdgeがViewer Requestフックでリクエストのヘッダー・Cookie・クエリ文字列を書き換えてCloudFrontのキャッシュキーを動的に構成し、OriginへのリクエストをLambdaの実行結果に基づいてTTLを変更してキャッシュヒット率を最大化する構成',
      'C. Lambda@EdgeがOrigin Requestフックで起動してOriginへのリクエストをすべてインターセプトし、OriginへのフォワードなしにLambda@Edgeがレスポンスを直接生成してCloudFrontのキャッシュに保存することで、Originの負荷をゼロにする完全エッジ処理構成',
      'D. Lambda@EdgeをViewer RequestとOrigin Responseの両フックに設定することで、Viewer RequestでのJWT認証と、Origin Responseでの動的なCache-Controlヘッダー書き換えを組み合わせ、ユーザーごとに異なるTTLでコンテンツをキャッシュする構成'
    ],
    answer: 'A',
    explanation: '【正解: A】Lambda@EdgeはCloudFrontの4つのトリガー（Viewer Request/Response、Origin Request/Response）で実行でき、エッジでのURL書き換え・A/Bテスト・認証・地域別リダイレクト・HTTPヘッダー操作などを実現します。グローバルに低レイテンシで実行できます。\n\n【Bが違う理由】Lambda@EdgeはカスタムキャッシュキーのロジックをCache Policyで補完できますが、CloudFrontのTTLをLambdaの実行時間に基づいて自動調整する機能はありません。TTLはCache-ControlヘッダーやCloudFrontのCache Policyで設定します。\n\n【Cが違う理由】Lambda@EdgeはOriginへのすべてのリクエストをトリガーするわけではなく、キャッシュヒット時はOriginに転送されません。また「OriginへのリクエストをすべてLambdaに転送」する構成では、キャッシュ効率が大幅に低下します。Lambda@EdgeはOriginの代替ではなくリクエスト/レスポンスの変換・フィルタリングが主な用途です。\n\n【Dが違う理由】Lambda@EdgeからDynamoDBへの書き込みは技術的には可能ですが、Lambda@Edgeの実行時間・メモリ制限（通常のLambdaより厳しい）を考慮すると、Origin ResponseでDynamoDBに記録する設計はレイテンシを増大させます。またLambda@Edgeからは特定のリージョンのDynamoDBのみアクセスできる制限もあります。'
  },
  {
    id: 41,
    level: 'intermediate',
    diagram: `
[S3 (入力データ)]
    ↓
[AWS Batch (ジョブキュー → EC2/Fargate)]
    ↓
[EFS (共有ストレージ：ジョブ間でデータ共有)]
    ↓
[S3 (出力結果)]
`,
    question: 'この構成図のユースケースとして最も適切なものはどれか？',
    choices: [
      'A. S3から大量の入力データを受け取り、AWS BatchがEC2/Fargateでバッチジョブを並列実行し、EFSで中間データを共有しながら結果をS3に出力する計算基盤',
      'B. AWS Batchのジョブキューが優先度の高いジョブから順にEC2/Fargateへ割り当て、EFSをジョブ間の排他制御（ロックファイル）に使用することで、同一ファイルへの競合書き込みを防ぎながらS3へ結果を出力するジョブ調停構成',
      'C. AWS BatchのSpotインスタンスが中断された際にEFSへの中間データを引き継ぎ先のEC2インスタンスに自動マウントし、S3からの再ダウンロードなしにジョブを途中から再開するチェックポイント再開構成',
      'D. S3からのデータをAWS BatchがEC2/Fargateに分配する際、EFSへの書き込み完了をポーリングで確認してから次のジョブを起動することで、ジョブ間の依存関係を維持しながら逐次処理する構成'
    ],
    answer: 'A',
    explanation: '【正解: A】AWS Batchはジョブキューとコンピューティング環境（EC2またはFargate）を管理し、S3から入力データを受け取って並列バッチ処理できます。EFSは複数のBatchジョブが共有できる中間ストレージとして利用でき、ゲノム解析・機械学習の前処理・大規模データ変換などに使われます。\n\n【Bが違う理由】AWS Batchは起動中のEC2インスタンスを監視してEFSの使用率でジョブを停止する機能はありません。リソース管理はBatch自身のコンピューティング環境設定（最小/最大vCPU等）で制御します。\n\n【Cが違う理由】S3のオブジェクトごとに独立したEC2を起動するのはBatchの典型的な用途ですが、「EFSへの書き込み完了オブジェクト数をS3メタデータとしてカウントする」機能はBatchもEFSも持ちません。ジョブ進捗管理にはDynamoDBやCloudWatch Metricsを使います。\n\n【Dが違う理由】EFSはファイルシステムであり、ジョブキューとして機能しません。AWS Batchのジョブキューはマネージドサービスとして提供されています。SQSをトリガーにBatchジョブを起動するパターンは実在しますが、EFSをキューとして使う構成は一般的ではありません。'
  },
  {
    id: 42,
    level: 'intermediate',
    diagram: `
[AWSアカウント全体]
    ↓ (API呼び出しの記録)
[CloudTrail (ログ収集)]
    ↓
[S3 (CloudTrailログ保管)]
    ↓
[Athena (SQLクエリ)]
    ↓
[分析結果・レポート]
`,
    question: 'この構成図のユースケースとして最も適切なものはどれか？',
    choices: [
      'A. AWSアカウントのAPI操作履歴をCloudTrailで収集・S3に蓄積し、Athenaで特定操作の検索や監査レポートを生成するセキュリティ監査基盤',
      'B. CloudTrailがS3に書き込んだログをAthenaが自動的に検知してインクリメンタルスキャンし、新規APIコールのみを差分クエリで評価することで、ログが増加してもAthenaのスキャン量とコストが増加しない構成',
      'C. S3に保存されたCloudTrailログをAthenaのビュー機能がリアルタイムで集計し、IAMユーザーごとのAPI呼び出し回数をCloudTrailが直接カウントすることで、Athenaのクエリ実行なしに監査レポートが生成される構成',
      'D. CloudTrailがリージョンをまたいだAPIコールをS3の単一バケットに集約し、AthenaがS3のバケットポリシーを読み取ってリージョン別にパーティションを自動作成することで、手動パーティション設定なしにクロスリージョンのログをクエリできる構成'
    ],
    answer: 'A',
    explanation: '【正解: A】CloudTrailはAWSアカウント内のAPI呼び出し（誰が・いつ・何をしたか）を記録し、S3にJSON形式で保存します。AthenaはS3上のデータをサーバーレスSQLで分析できるため、特定IAMユーザーの操作履歴・異常なリソース変更・コンプライアンス監査レポートの作成に使われます。\n\n【Bが違う理由】AthenaはS3への書き込みイベントをトリガーに自動でSQLを実行する機能を持ちません。Athenaはユーザーが手動またはスケジュールで実行するアドホッククエリサービスです。リアルタイム異常検知にはCloudWatch Logs Insights・GuardDuty・EventBridgeが適しています。\n\n【Cが違う理由】AthenaはS3のデータをスキャンした量に応じて課金されます。パーティションなしで全件スキャンするとコストが高くなります。コスト最適化には日付・リージョンなどでパーティション分割が必要です。「コストがかからない」は誤りです。\n\n【Dが違う理由】CloudTrailはS3にログを書き込むサービスであり、AthenaのテーブルにデュアルライトするAPIは存在しません。AthenaはS3に配置されたデータに対してクエリするサービスです。S3を経由しないAthenaクエリはデータソース設定上不可能です。'
  },
  {
    id: 43,
    level: 'intermediate',
    diagram: `
[アプリケーション]
    ↓ (書き込み)
[DynamoDB]
    ↓ (DynamoDB Streams)
[Lambda (差分データを変換)]
    ↓
[OpenSearch Service (インデックス同期)]
    ↓
[検索API (全文検索・複合クエリ)]
`,
    question: 'この構成図のユースケースとして最も適切なものはどれか？',
    choices: [
      'A. DynamoDBへの書き込みをStreamsで捕捉してLambdaがOpenSearchにリアルタイム同期し、DynamoDBにない全文検索・複合クエリを実現する構成',
      'B. DynamoDB StreamsがLambdaをトリガーして変換処理を行い、LambdaはOpenSearch Serviceへの書き込みとともにDynamoDBのTTLを更新することで、OpenSearchのインデックスとDynamoDBのデータ保持期間が常に同期される構成',
      'C. LambdaがDynamoDB Streamsから受け取った差分データをOpenSearch Serviceに送信する際、OpenSearchのインデックスが存在しない場合はDynamoDBのデータを全件スキャンして再構築するため、StreamsはOpenSearchの差分同期とフル同期を兼ねるトリガーとして機能する構成',
      'D. OpenSearch ServiceがDynamoDB Streamsに直接接続するネイティブ統合を利用し、LambdaはOpenSearchのインデックス設定（マッピング・アナライザー）をDynamoDBのテーブル定義変更に追従して自動更新する管理用コンポーネントとして機能する構成'
    ],
    answer: 'A',
    explanation: '【正解: A】DynamoDBは単純なキー・インデックス検索には優れていますが、全文検索・地理検索・ファセット検索・複合集計クエリは苦手です。DynamoDB Streams→Lambda→OpenSearchパターンで変更差分をリアルタイムにOpenSearchへ同期し、検索クエリはOpenSearchに向けることで両者のメリットを活かせます。\n\n【Bが違う理由】OpenSearch ServiceがDynamoDB Streamsを直接ポーリングする機能はありません。Streamsのコンシューマーとして使えるのはLambdaやKinesis Data Streamsです。OpenSearchはインデックスストアであり、外部データソースを自律的にポーリングしません。\n\n【Cが違う理由】デュアルライト方式（DynamoDBとOpenSearchの両方に書き込む）は実装可能ですが、アプリケーション側の複雑さが増し、どちらかへの書き込み失敗時の整合性管理が困難です。Streams経由での非同期同期の方が一般的なパターンです。図の構成もStreams経由の同期を示しています。\n\n【Dが違う理由】DynamoDB Scanで全件取得してOpenSearchに同期するのは、データ量が増えると非常に非効率でコストも高くなります。Streamsは変更差分（CDC: Change Data Capture）を捉えるために使うものであり、コールドスタート防止のウォームアップトリガーとしては使いません。'
  },
  {
    id: 44,
    level: 'intermediate',
    diagram: `
[データソース (IoT / アプリ)]
    ↓
[Kinesis Data Streams]
    ↓
[Kinesis Data Analytics (Flink SQL)]
    ↓ (異常検知ルール合致)
[Lambda]
    ↓
[DynamoDB (アラート記録)] + [SNS (通知)]
`,
    question: 'この構成図のユースケースとして最も適切なものはどれか？',
    choices: [
      'A. ストリームデータをFlinkSQLでリアルタイム分析し、異常パターン検出時にLambdaでアラートを記録・通知するリアルタイム異常検知基盤',
      'B. Kinesis Data AnalyticsのFlink SQLがKinesis Data Streamsのシャードごとに異常検知ルールを並列適用し、同一シャードから生成された重複アラートをLambdaが排除してからDynamoDBとSNSへ一度だけ通知する冪等性保証構成',
      'C. LambdaがKinesis Data Analyticsから受け取ったアラートをDynamoDBに書き込む際、同一のイベントIDが既にDynamoDBに存在する場合はSNS通知をスキップすることで、Flink SQLのウィンドウ再計算による重複通知を防ぐ構成',
      'D. Kinesis Data AnalyticsのFlink SQLウィンドウ関数が時系列データを集計してアラートを生成し、LambdaはそのアラートをDynamoDBに条件付き書き込み（ConditionExpression）で記録することで、SNS通知とDynamoDB書き込みの順序を保証する構成'
    ],
    answer: 'A',
    explanation: '【正解: A】Kinesis Data Analytics（Apache Flink）はストリームデータに対してSQLまたはJava/Pythonでリアルタイム分析ができます。スライディングウィンドウ・タンブリングウィンドウによる集計や異常検知ルールを定義し、条件合致時にLambdaをトリガーしてDynamoDBにアラートを記録・SNSで通知するパターンは、IoTセンサーの異常値検出・金融不正検知などに使われます。\n\n【Bが違う理由】Kinesis Data AnalyticsはKinesis Data Streamsからリアルタイムでデータを受信します（ポーリングではなくストリーム消費）。またFlink SQLのアラートをS3に一時保存してからLambdaがバッチ処理する構成は、リアルタイム性が失われ「準リアルタイム」になります。図の構成はリアルタイムを示しています。\n\n【Cが違う理由】LambdaがKinesis Data AnalyticsとKinesis Data Streams両方をポーリングして重複除去する構成は図と一致しません。データフローはKinesis Streams→Analytics→Lambdaの一方向です。\n\n【Dが違う理由】Kinesis Data AnalyticsはDynamoDBを直接参照するクエリエンジンではありません。ストリームデータのみをインプットとしてリアルタイム処理します。またLambdaがDynamoDBとSNSへの書き込みを「直列」にする必然性はなく、並列実行してもアプリケーション設計次第で整合性は保てます。'
  },
  {
    id: 45,
    level: 'intermediate',
    diagram: `
[SQS Queue (ジョブメッセージ)]
    ↓ (メッセージ取得)
[ECS Fargate (Spot: コスト最適化)]
    ↓ (処理完了)
[S3 (結果保存)]
`,
    question: 'この構成図のユースケースとして最も適切なものはどれか？',
    choices: [
      'A. SQSのジョブメッセージをFargate Spotが消費して処理し、結果をS3に保存するコスト最適化されたバッチワーカー構成',
      'B. Fargate SpotのタスクがSQSのメッセージ数に応じてApplication Auto Scalingで自動スケールし、Spot中断通知を受けたタスクがVisibility Timeoutをリセットしてメッセージをキューに戻すことで、処理の中断と再試行をSQS側で吸収する構成',
      'C. SQSのVisibility Timeoutが切れた未処理メッセージをFargate Spotが再取得して処理するため、タスク中断時の再処理はFargate側のチェックポイント機能ではなくSQSのメッセージ再配信に依存する設計',
      'D. Fargate SpotがSQSからメッセージを取得して処理した後、S3への書き込み完了を確認してからSQSメッセージを削除するため、S3への書き込みが失敗した場合はVisibility Timeoutの経過後にメッセージが再処理される構成'
    ],
    answer: 'A',
    explanation: '【正解: A】Fargate Spotは通常のFargateより最大70%安く利用できるスポットキャパシティです。SQSをジョブキューとして使い、Fargate Spotタスクがメッセージを取得して処理し、結果をS3に保存するパターンは、動画変換・データ処理・機械学習バッチなど中断許容可能なワークロードのコスト最適化に使われます。\n\n【Bが違う理由】「Spotの中断時にSQSのVisibility TimeoutでFargate On-DemandへルーティングするFargate固有のフェイルオーバー機能」は存在しません。Fargate SpotのインスタンスはAWSから30秒の中断通知が来るため、アプリ側でのグレースフルシャットダウン設計が必要です。未処理のSQSメッセージはVisibility Timeoutが切れれば他のタスクが処理できますが、On-Demandへの自動ルーティングはありません。\n\n【Cが違う理由】SpotインスタンスのMDN（メタデータ通知）はEC2に存在しますが、Fargateの中断通知はECSタスク停止イベントとして通知されます。「SQSメッセージをキューに返却する」機能はFargate側にはなく、アプリケーションがメッセージを明示的にキューに戻すか、Visibility Timeoutを利用して自動戻しを待つ設計が必要です。\n\n【Dが違う理由】SQSのロングポーリングはメッセージが届くまで最大20秒待機する機能ですが、これはFargate Spotのタスク処理に追加レイテンシを与えるものではありません。ロングポーリングはメッセージがない場合の空振りAPI呼び出しを減らすためのものです。'
  },

  // --- ADVANCED（問46〜50）---
  {
    id: 46,
    level: 'advanced',
    diagram: `
[社内システム / VPC内クライアント]
    ↓
[VPC Interface Endpoint]
    ↓
[API Gateway (プライベートエンドポイント)]
    ↓ (VPC Linkを介さず / VPC Link経由)
[NLB (Network Load Balancer)]
    ↓
[ECS / EC2 (バックエンドAPI)]
`,
    question: 'この構成図のユースケースとして最も適切なものはどれか？',
    choices: [
      'A. インターネットに公開せずVPC内からのみアクセスできるプライベートAPI Gateway経由でNLBとECSバックエンドを呼び出す社内API構成',
      'B. VPC Interface EndpointがAPI GatewayのプライベートエンドポイントへのトラフィックをVPC内で終端し、NLBはAPI Gatewayのタイムアウト制限（最大29秒）を超えるバックエンド処理のためにAPI Gatewayを迂回してECSへ直接ロングポーリングリクエストを送る構成',
      'C. API GatewayのプライベートエンドポイントはVPC Interface Endpointを通じてのみアクセス可能であり、NLBがECSタスクのヘルスチェックを兼ねることでAPI GatewayのステージごとのカナリアデプロイをECSタスク単位で制御できる構成',
      'D. VPC Interface EndpointのエンドポイントポリシーでAPI Gatewayへのアクセスを特定のIAMロールに制限し、NLBのターゲットグループがECSタスクのIPアドレスを動的に管理することでAPI Gatewayのリソースポリシーを都度更新せずに済む構成'
    ],
    answer: 'A',
    explanation: '【正解: A】API Gatewayのプライベートエンドポイントタイプを使うと、インターネットからはアクセスできず、VPC Interface Endpoint経由でのみ到達できます。VPC Linkを使えばAPI GatewayからVPC内のNLB経由でECS/EC2バックエンドを呼び出せます。社内APIや機密性の高いサービスの内部公開に使われます。\n\n【Bが違う理由】NLBはAPI Gatewayのスロットリングをバイパスするための経路ではありません。API Gatewayのレート制限はUsage Planで管理され、NLBはバックエンドへの振り分けを担います。NLBへのアクセスはAPI Gateway経由が前提の構成です。\n\n【Cが違う理由】VPC Interface EndpointはAWS PrivateLinkを使ったプライベート接続を提供しますが、「リクエストを暗号化する」機能はありません。TLS終端はNLBまたはECSタスク側で設定します。EndpointはルーティングとプライベートIPの割り当てを担います。\n\n【Dが違う理由】プライベートAPI GatewayはWAFとCognito認証を自動で有効化しません。WAF・Cognitoはそれぞれ別途設定が必要です。またプライベートエンドポイントでもリソースポリシーによりIAM認証を強制できます。「認証なしでAPIを利用できる」は誤りです。'
  },
  {
    id: 47,
    level: 'advanced',
    diagram: `
[Client]
    ↓
[API Gateway]
    ↓
[Lambda (前処理・コンテキスト構築)]
    ↓
[SageMaker Endpoint (MLモデル推論)]
    ↓
[Lambda (後処理・レスポンス整形)]
    ↓
[DynamoDB (推論結果キャッシュ)]
`,
    question: 'この構成図のユースケースとして最も適切なものはどれか？',
    choices: [
      'A. クライアントのリクエストをLambdaで前処理してSageMakerに推論させ、結果を後処理してDynamoDBにキャッシュするMLモデルのリアルタイム推論APIパイプライン',
      'B. 前処理LambdaがリクエストのパラメータをDynamoDBのキャッシュと照合し、一致する推論結果が存在する場合はSageMaker Endpointを呼び出さずにキャッシュを返すことで、SageMakerの推論コストとレイテンシを削減するキャッシュファースト構成',
      'C. 後処理LambdaがSageMakerの推論結果をDynamoDBに書き込む際、同一リクエストの並列実行による重複書き込みをDynamoDBの条件付き書き込みで防ぎ、前処理LambdaはDynamoDBの書き込み結果を確認してからクライアントにレスポンスを返す構成',
      'D. SageMaker Endpointがスケールイン状態のときに前処理Lambdaがコールドスタートのレイテンシを吸収するためリクエストをDynamoDBに一時保存し、後処理LambdaがDynamoDBをポーリングして推論結果と突合する非同期推論構成'
    ],
    answer: 'A',
    explanation: '【正解: A】API Gateway→Lambda（前処理）→SageMaker Endpoint（推論）→Lambda（後処理）→DynamoDB（キャッシュ）はMLモデルをAPIとして公開する典型パターンです。前処理でリクエストをモデルの入力形式に変換し、後処理で推論結果をAPIレスポンス形式に整形します。DynamoDBのキャッシュで同一入力への重複推論を回避できます。\n\n【Bが違う理由】SageMaker EndpointはAPI GatewayからはHTTPSで直接呼び出せますが、VPCやIAM認証の制御、前後処理のロジックを持たせるためにLambdaを介するのが一般的です。LambdaがSageMakerのバージョン管理のみを担う構成はこの図の意図と一致しません。\n\n【Cが違う理由】キャッシュファースト構成を採用することは可能ですが、図の矢印の流れはLambda→SageMaker→Lambda→DynamoDBであり、DynamoDBのキャッシュを先に確認する流れは示されていません。「DynamoDBへの書き込みがない新規リクエスト時のみSageMakerが起動する」という説明も図と不一致です。\n\n【Dが違う理由】図にStep Functionsは登場しません。API Gateway→Lambda→SageMaker→Lambda→DynamoDBはLambda内のコードで順番に呼び出す同期パターンであり、Step Functionsによるオーケストレーションは図から読み取れません。'
  },
  {
    id: 48,
    level: 'advanced',
    diagram: `
[EventBridge (毎月第2火曜日 など)]
    ↓
[Systems Manager Automation (パッチ適用ドキュメント)]
    ↓
[EC2インスタンス群 (タグ指定)]
    ↓ (パッチ適用・再起動)
[Systems Manager Patch Manager]
    ↓
[S3 (パッチ適用レポート保存)]
`,
    question: 'この構成図のユースケースとして最も適切なものはどれか？',
    choices: [
      'A. EventBridgeのスケジュールでSystems Managerを起動し、タグで指定したEC2インスタンスに自動でOSパッチを適用してレポートをS3に保存する自動パッチ管理構成',
      'B. Systems Manager AutomationがEventBridgeのスケジュールをトリガーにEC2インスタンスを停止してパッチを適用し、Patch Managerがパッチ適用後にインスタンスを自動起動してS3にコンプライアンスレポートを書き込む際、インスタンスの再起動タイミングはPatch Managerではなく再起動ドキュメントを呼び出すAutomationが制御する構成',
      'C. EventBridgeのスケジュールがSystems Manager Automationを起動し、AutomationがPatch Managerのパッチベースラインに従ってEC2インスタンスのパッチを適用する際、タグによるターゲット指定はPatch Managerではなく Systems Manager Automationのパラメータとして渡される構成',
      'D. Systems Manager Patch ManagerがEC2インスタンスへのパッチ適用結果をS3に書き込み、EventBridgeがS3へのPutObjectイベントをトリガーにSystems Manager Automationを起動してパッチ適用に失敗したインスタンスを再処理するエラーハンドリング構成'
    ],
    answer: 'A',
    explanation: '【正解: A】Systems Manager Patch Managerは、Patch Baselineで承認されたパッチをEC2インスタンスに自動適用する機能です。EventBridgeのスケジュール（cron/rate式）でSystems Manager Automationドキュメントを定期実行し、タグ（例: PatchGroup=Production）で対象EC2を絞り込んでパッチ適用できます。結果レポートはS3に出力され、パッチコンプライアンス状況を把握できます。\n\n【Bが違う理由】Systems Manager AutomationがEventBridgeのスケジュールを動的に書き換えることはできません。スケジュールの変更はEventBridgeのAPIで行います。CPU使用率に応じてメンテナンスウィンドウを調整する機能もSystems Managerにはありません。\n\n【Cが違う理由】Patch Managerがパッチを取得するのはEC2インスタンスから見たOSパッケージリポジトリ（Windows Update、yumリポジトリ等）またはS3のカスタムパッチソースです。EventBridgeがパッチ完了後にレポートをS3にコピーするという機能は存在せず、レポートはSystems Managerが直接S3に書き込みます。\n\n【Dが違う理由】EventBridgeがS3のパッチレポートを監視してSystems Managerを再起動する構成は、S3イベント通知→EventBridge→Systems Manager Automationの流れで実現可能ですが、図の矢印はEventBridgeがトリガーの起点であり、S3をEventBridgeが監視する逆向きの流れは示されていません。'
  },
  {
    id: 49,
    level: 'advanced',
    diagram: `
[イベント発生 (アプリ / スケジュール)]
    ↓
[EventBridge]
    ↓
[SNS Topic]
  ↓         ↓         ↓
[Email    [SMS       [Lambda
 (購読者)] (購読者)]  (Slack/Teams通知)]
    ↓
[DynamoDB (通知ログ記録)]
`,
    question: 'この構成図のユースケースとして最も適切なものはどれか？',
    choices: [
      'A. 1つのイベントをEmail・SMS・Slack等の複数チャンネルへ同時配信するマルチチャネル通知基盤',
      'B. SNS TopicがEmail・SMS・Lambdaに並列配信し、LambdaがSlack/Teamsへの通知とDynamoDBへのログ記録を順次実行するが、SNSのメッセージサイズ制限（256KB）を超えたイベントはEventBridgeがDynamoDBに直接書き込んでSNSへの配信をスキップする構成',
      'C. EventBridgeがSNS Topicにイベントを送信する際、SNSのサブスクリプションフィルターポリシーによりEmail・SMS・Lambdaへの配信対象イベントを個別に絞り込み、DynamoDBへのログ記録対象はLambdaがSNSから受け取ったメッセージ属性をもとに判定する構成',
      'D. LambdaがSlack/Teams通知を送信した後にDynamoDBへのログ記録を行うため、Slack APIのレート制限でLambdaが再試行を繰り返した場合でも、SNSの配信リトライポリシーによりDynamoDBへの記録は必ず1回だけ保証される構成'
    ],
    answer: 'A',
    explanation: '【正解: A】EventBridgeがイベントを受け取りSNS Topicにpublishすると、Email・SMS・Lambdaの各サブスクライバーに並列で配信されます。Lambdaは受け取ったメッセージをSlack/Teamsに転送し、DynamoDBに通知ログを記録します。障害通知・アラート・業務イベントの多チャネル配信に使われます。\n\n【Bが違う理由】SNSのフィルタリングポリシーは配信先を絞るために使いますが、「除外されたメッセージのみDynamoDBに記録する」という動作はSNSの標準機能にありません。DynamoDBへの記録はLambdaが通知処理と合わせて行います。\n\n【Cが違う理由】SNSがDynamoDB Streamsをポーリングする機能はありません。SNSは他のサービスからpublishを受けてサブスクライバーに配信するサービスです。DynamoDB Streamsのコンシューマーとして使えるのはLambdaやKinesisです。\n\n【Dが違う理由】この選択肢はLambdaがSlack通知とDynamoDB書き込みを逐次実行した場合の潜在的リスクを指摘していますが、「構成図のユースケース」を問う問題として最も適切な説明ではありません。実装上のリスクは正しい指摘ですが、構成図が示す「マルチチャネル通知基盤」がAの説明より適切です。また実装ではDynamoDBへの書き込みをSlack通知と独立させることでこのリスクは回避できます。'
  },
  {
    id: 50,
    level: 'advanced',
    diagram: `
[開発者 (コードPush)]
    ↓
[CodePipeline]
    ↓
[CodeBuild (ビルド・テスト)]
    ↓ (コードレビューAPI呼び出し)
[CodeGuru Reviewer]
    ↓ (指摘事項をPRコメントに反映)
[CodeBuild (指摘なし → 継続)]
    ↓
[デプロイステージ (ECS / Lambda)]
`,
    question: 'この構成図のユースケースとして最も適切なものはどれか？',
    choices: [
      'A. CI/CDパイプラインにCodeGuru Reviewerを組み込み、機械学習ベースのコード品質チェックをPRマージ前に自動実行するDevSecOps構成',
      'B. CodeBuildがCodeGuru ReviewerのAPIを呼び出してコードレビューを要求し、CodeGuru ReviewerがCodeBuildのビルドアーティファクトを静的解析してセキュリティ上の問題を検出した場合、CodeBuildがCodePipelineに失敗ステータスを返してデプロイを中止する構成',
      'C. CodeGuru ReviewerがPRのコード差分ではなくCodeBuildが生成したビルドログを解析して推奨事項を生成し、指摘件数がしきい値を超えるとCodePipelineが自動的にデプロイステージをスキップして開発者にSNS通知を送る構成',
      'D. CodePipelineがCodeGuru ReviewerのAPIを直接呼び出してレビュー結果を取得し、重大度スコアがしきい値以下の場合のみデプロイステージに進む構成であり、CodeBuildはCodeGuru ReviewerのレビューIDをアーティファクトとしてCodePipelineに渡す役割を担う構成'
    ],
    answer: 'A',
    explanation: '【正解: A】CodeGuru Reviewerは機械学習ベースでコードの潜在的バグ・セキュリティ脆弱性・非効率なコードパターンを検出します。CodePipelineのビルドステージからCodeGuru Reviewer APIを呼び出すことで、PRマージ前に自動コードレビューをCI/CDパイプラインに組み込めます。\n\n【Bが違う理由】CodeGuru ReviewerはCodeBuildのビルドログをリアルタイム解析する機能はありません。ソースコード（GitリポジトリのPR）を解析します。また「自動修正」の機能はなく、指摘事項（Findings）をPRコメントや結果として出力するのみです。\n\n【Cが違う理由】CodeGuru ReviewerはFindingsの重大度（CRITICAL/HIGH/MEDIUM/LOW/INFO）を返しますが、CodePipelineがスコアのしきい値を自動評価してパイプラインを停止する組み込み機能はありません。しきい値による停止制御にはLambdaやCodeBuildのカスタムスクリプトで実装が必要です。またCodeBuildが自動でロールバックブランチを作成する機能もありません。\n\n【Dが違う理由】CodeGuru Reviewerは現在Java・Python・JavaScript・TypeScript等の複数言語に対応しています。「JavaとPythonのみ」は古い情報または誤りです。なお、複数のlinterとCodeGuru ReviewerのスコアをCodePipelineが自動集約評価する標準機能はなく、カスタム実装が必要です。'
  },

  // ============================================================
  // 問51〜70（新規追加）
  // BASIC: 51〜55 / INTERMEDIATE: 56〜65 / ADVANCED: 66〜70
  // ============================================================

  // ---- BASIC 51〜55 ----
  {
    id: 51,
    level: 'basic',
    diagram: `
[User]
  ↓ (SFTP / FTP)
[Transfer Family (SFTP endpoint)]
  ↓
[S3 Bucket]
`,
    question: 'この構成図のユースケースとして最も適切なものはどれか？',
    choices: [
      'A. S3バケットへのオブジェクトアップロードをトリガーにTransfer FamilyがSFTPセッションを新たに開始し、ファイルをオンプレミスへ折り返し転送する双方向同期構成',
      'B. Transfer FamilyのSFTPエンドポイントはDNS名の解決のみを担い、実際のファイル転送プロトコルの処理はS3バケットのエンドポイントが直接実行する構成',
      'C. 既存のSFTPクライアントを使ったファイル転送をS3に移行するマネージドSFTPサーバー',
      'D. Transfer FamilyがS3バケットへのアクセス権をSFTPユーザーに委任しており、ユーザーはFTPクライアントではなくS3の署名付きURLを使ってファイルをダウンロードする構成'
    ],
    answer: 'C',
    explanation: '【正解: C】AWS Transfer FamilyはSFTP・FTP・FTPSといった既存のファイル転送プロトコルをそのまま使いながら、バックエンドのストレージをS3（またはEFS）にするマネージドサービスです。オンプレのSFTPサーバーをAWSに移行する際の代表的なユースケースです。\n\n【Aが違う理由】Transfer FamilyはS3へのファイル受信をマネージドに行いますが、S3への書き込みをトリガーにオンプレへ折り返し転送する機能は持ちません。オンプレへのデータ転送にはDataSyncを使います。\n\n【Bが違う理由】Transfer FamilyはS3だけでなくEFSもバックエンドとして選択できますが、この構成図にはS3が描かれています。「S3ではなくEFS」という説明は図の読み取りとして誤りです。\n\n【Dが違う理由】Transfer FamilyはSFTP/FTPクライアント向けのエンドポイントを提供するサービスであり、ブラウザ向けのダウンロードURLを発行する機能はありません。それはS3の署名付きURLやCloudFrontの役割です。'
  },
  {
    id: 52,
    level: 'basic',
    diagram: `
[オンプレミス NFS/SMB]
  ↓ (DataSync Agent)
[DataSync]
  ↓
[S3 Bucket]
`,
    question: 'この構成図のユースケースとして最も適切なものはどれか？',
    choices: [
      'A. DataSync Agentがオンプレミスのファイル変更をリアルタイムに検知してS3へストリーミングアップロードし、S3バケットがNFSマウントポイントとしてオンプレミスから直接参照可能になる構成',
      'B. オンプレミスのファイルサーバーからS3へのデータ移行・同期',
      'C. DataSyncがS3バケット内のオブジェクト変更を検知してオンプレミスのNFSサーバーへ自動的にプッシュする、クラウド起点の双方向同期構成',
      'D. DataSync AgentがオンプレミスのNFSとS3の間で差分チェックを行い、S3をキャッシュ層として使用しながら元データはオンプレミスのNFSにのみ保持する構成'
    ],
    answer: 'B',
    explanation: '【正解: B】AWS DataSyncはオンプレミスのNFS・SMBファイルサーバーからS3・EFS・FSxへのデータ移行・定期同期をマネージドに行うサービスです。DataSync Agentをオンプレに配置し、差分転送・帯域制限・暗号化を自動管理します。\n\n【Aが違う理由】DataSyncはNFSをS3内に仮想マウントする機能を持ちません。S3のデータをEC2からファイルシステムのようにアクセスしたい場合はS3 File Gatewayを使います。\n\n【Cが違う理由】DataSyncはオンプレ→クラウドの一方向転送が基本的な用途であり、S3の変更をリアルタイムに検知してオンプレへプッシュする双方向リアルタイム同期の用途ではありません。双方向同期が必要な場合はStorage Gatewayが適切です。\n\n【Dが違う理由】DataSyncはS3への書き込みをインターセプトしてキャッシュ層として使う機能を持ちません。S3をキャッシュ層として使いオンプレにデータを保持するアーキテクチャはStorage Gateway（File Gateway）のユースケースです。'
  },
  {
    id: 53,
    level: 'basic',
    diagram: `
[App Runner Service]
  ↓
[RDS (PostgreSQL / MySQL)]
`,
    question: 'この構成図のユースケースとして最も適切なものはどれか？',
    choices: [
      'A. App RunnerがRDSのリードレプリカへの接続を自動的に検出してクエリをルーティングするコネクションプーリング層として動作し、書き込みと読み取りを自動で振り分ける構成',
      'B. App RunnerのオートスケールによりRDSへの同時接続数が急増した場合、App RunnerがRDSのmax_connectionsを動的に引き上げて接続枯渇を防ぐ高スケーラビリティ構成',
      'C. RDSのメンテナンスウィンドウをApp Runnerのヘルスチェック設定と連動させることで、RDS再起動時にApp Runnerが自動的にトラフィックを停止・再開するゼロダウンタイム構成',
      'D. コンテナイメージをデプロイするだけでインフラ管理不要なWebアプリケーションの構築'
    ],
    answer: 'D',
    explanation: '【正解: D】AWS App RunnerはDockerイメージまたはソースコードから自動でコンテナをビルド・デプロイし、ロードバランサーやオートスケールまでマネージドに提供するサービスです。RDSと組み合わせることで、インフラ管理を最小限にしたWebアプリを素早く構築できます。\n\n【Aが違う理由】App RunnerはRDSのコネクションプーリングやリードレプリカへの自動振り分け機能を持ちません。コネクションプーリングにはRDS Proxyを使います。\n\n【Bが違う理由】App Runnerはオートスケール機能を持ちますが、スケールアウトするとRDSへの同時接続数も増加します。接続枯渇を防ぐにはRDS Proxyを別途導入する必要があり、App Runner単体でこの問題は解決しません。\n\n【Cが違う理由】App RunnerはWebアプリケーションのホスティングサービスであり、RDSのバックアップスケジュールをトリガーするジョブ実行機能は持ちません。バックアップのトリガーにはEventBridge + LambdaやAWS Backupを使います。'
  },
  {
    id: 54,
    level: 'basic',
    diagram: `
[Lambda]
  ↓ (トレース)
[X-Ray]
  ↓
[CloudWatch (メトリクス・ログ)]
`,
    question: 'この構成図のユースケースとして最も適切なものはどれか？',
    choices: [
      'A. X-RayがLambdaの実行ログをリアルタイムにCloudWatchへ転送するエージェントとして機能し、CloudWatchはそのログからトレースIDを抽出してサービスマップを生成する構成',
      'B. Lambdaのパフォーマンスとエラーを分散トレーシングで可視化・監視する構成',
      'C. CloudWatchアラームがX-Rayのトレースデータをポーリングして評価し、エラーレートが閾値を超えた場合にLambdaの実行ロールを自動的に切り替えて障害を分離する構成',
      'D. LambdaがX-Rayにトレースを送信するとX-Rayが自動的にCloudWatch Logsへもデータを複製するため、CloudWatch側に個別のロググループを設定せずにLambdaのログを参照できる構成'
    ],
    answer: 'B',
    explanation: '【正解: B】AWS X-RayはLambdaなどのサービス間のリクエストを追跡・可視化する分散トレーシングサービスです。CloudWatchと組み合わせることで、レイテンシー・エラー率・ボトルネックをService MapやTraceから分析できます。\n\n【Aが違う理由】X-RayはLambdaのログをCloudWatchに転送するエージェントではありません。LambdaのログはLambda自身がCloudWatch Logsに送信します。X-Rayはトレース（リクエストの追跡）に特化したサービスです。\n\n【Cが違う理由】CloudWatchアラームはX-Rayのトレース結果を直接評価する機能を持ちません。X-RayのメトリクスをCloudWatchに送り、それをアラームで監視することは可能ですが、「エラー時にLambdaを自動再実行する」という自己修復の仕組みはこの図には含まれていません。\n\n【Dが違う理由】LambdaはX-Rayにトレースデータを送りますが、メトリクス（実行回数・エラー率・継続時間など）はLambdaがCloudWatchに直接送信します。CloudWatchは独自にLambdaのログとメトリクスを収集しており、X-Ray経由でのみ取得するわけではありません。'
  },
  {
    id: 55,
    level: 'basic',
    diagram: `
[Route 53]
  ↓
[Shield Advanced]
  ↓
[CloudFront]
  ↓
[WAF]
  ↓
[ALB / EC2]
`,
    question: 'この構成図のユースケースとして最も適切なものはどれか？',
    choices: [
      'A. WAFのIPブラックリストルールをShield Advancedが自動更新し、DDoS時にRoute 53が別リージョンへ自動フェイルオーバーする高可用性防御構成',
      'B. CloudFrontがSSL終端とWAFのルール適用を担い、Shield AdvancedはRoute 53〜CloudFront間のトランジットのみを保護する構成',
      'C. DDoS攻撃・Webアプリ攻撃から多層防御するセキュリティ構成',
      'D. Shield AdvancedがDNSレベルでリクエストを検査し、WAFが通過させたトラフィックをRoute 53が最終的にフィルタリングする多段インスペクション構成'
    ],
    answer: 'C',
    explanation: '【正解: C】Route 53（DNSレベル） → Shield Advanced（DDoS保護） → CloudFront（エッジキャッシュ・グローバル分散） → WAF（SQLインジェクション・XSS等のルールフィルタ） → ALB/EC2 という多層防御は、大規模なDDoS攻撃とWebアプリ攻撃を組み合わせた脅威に対する標準的なセキュリティアーキテクチャです。\n\n【Aが違う理由】Shield AdvancedはWAFのIPブラックリストを自動更新する機能（AWS Managed Rulesとの連携はあります）を直接持ちません。また、Route 53の自動フェイルオーバーは可能ですが、それはShield Advancedが起動するのではなくRoute 53のヘルスチェック設定によるものです。\n\n【Bが違う理由】Shield AdvancedはRoute 53・CloudFront・ALBなど複数のリソースをまとめて保護するサービスです。「Route 53〜CloudFront間のトランジットのみ」という限定的な説明は誤りであり、バックエンドのALB・EC2も保護対象に含まれます。\n\n【Dが違う理由】Shield AdvancedはDNSレベルでリクエストを個別に検査する機能を持ちません。Shield AdvancedはDDoSトラフィックを検知・吸収するサービスであり、HTTPリクエストの内容を検査するのはWAFの役割です。また、Route 53が「最終フィルタ」として機能する構成でもありません。'
  },

  // ---- INTERMEDIATE 56〜65 ----
  {
    id: 56,
    level: 'intermediate',
    diagram: `
[User]
  ↓
[Amplify (フロントエンドホスティング)]
  ↓
[Cognito User Pool (認証)]
  ↓ (JWT)
[API Gateway]
  ↓
[Lambda]
  ↓
[DynamoDB]
`,
    question: 'この構成図のユースケースとして最も適切なものはどれか？',
    choices: [
      'A. Amplifyがホストするフロントエンドアプリが、Cognitoで認証してAPIを呼び出すフルスタックサーバーレスWebアプリ',
      'B. CognitoがAmplifyホスティングのオリジンサーバーとして機能し、ユーザー認証が完了するとCognitoがAPI GatewayへリクエストをプロキシしてLambdaを直接起動する構成',
      'C. API GatewayがCognitoのUser Poolを直接クエリしてユーザー属性を取得し、その結果をJWTに追加してからLambdaに渡すことでLambdaはDynamoDBへの書き込みのみを担う構成',
      'D. LambdaがCognito User PoolのJWTトークンを自前で検証した後にDynamoDBへ書き込むため、API GatewayにCognitoオーソライザーを設定すると二重検証になりレイテンシが増加する構成'
    ],
    answer: 'A',
    explanation: '【正解: A】AWS Amplifyでフロントエンド（React・Vue・Next.jsなど）をホストし、Cognito User Poolでサインアップ・ログイン認証を行い、取得したJWTをAPI Gatewayに渡してLambda・DynamoDBでAPIバックエンドを動かすフルスタックサーバーレス構成です。Amplify CLIがこの一連の構成を自動生成します。\n\n【Bが違う理由】CognitoはAmplifyのCDNキャッシュキーとして機能する機能を持ちません。AmplifyはCloudFrontをバックエンドに使いますが、認証とキャッシュキーは別の概念です。ユーザーごとのパーソナライズはLambda@EdgeやCloudFront FunctionsとCognitoを組み合わせて実現しますが、この図の構成とは異なります。\n\n【Cが違う理由】API GatewayはCognito User Poolを「Cognito Authorizer」として設定してJWTを検証しますが、User Poolを直接クエリしてユーザー情報を取得する機能はありません。ユーザー情報の取得にはLambdaからCognito APIを呼び出す必要があります。\n\n【Dが違う理由】LambdaでJWT検証を自前実装することは可能ですが、それはアンチパターンです。API GatewayにCognito Authorizerを設定することで、Lambdaを呼び出す前にJWT検証を行い、無効なリクエストをリジェクトできます。「API Gatewayのオーソライザー設定不要」という説明はセキュリティ上の誤解を招きます。'
  },
  {
    id: 57,
    level: 'intermediate',
    diagram: `
[User]
  ↓
[API Gateway]
  ↓
[Lambda]
  ↓
[Bedrock (Claude / Titan)]
  ↓ (レスポンス)
[Lambda]
  ↓
[DynamoDB (会話履歴)]
`,
    question: 'この構成図のユースケースとして最も適切なものはどれか？',
    choices: [
      'A. API Gateway + Lambda経由でBedrockのFMを呼び出し、会話履歴をDynamoDBに保存するサーバーレスAIチャットボット',
      'B. LambdaがBedrockにアクセスする際にDynamoDBの会話履歴を渡してコンテキストを構築するが、Bedrockがその履歴をもとにモデルをセッションごとにファインチューニングするため応答精度が継続的に向上する構成',
      'C. BedrockがDynamoDBの会話履歴テーブルに直接アクセスしてコンテキストを参照するため、LambdaはAPI GatewayとBedrockの間のリクエスト変換のみを担い、DynamoDBへの書き込みはBedrockが行う構成',
      'D. API GatewayがBedrockのストリーミングレスポンスをWebSocketで受け取りLambdaに渡すため、DynamoDBへの会話履歴の保存はBedrockがレスポンスを完了した後にEventBridgeをトリガーにして非同期で行われる構成'
    ],
    answer: 'A',
    explanation: '【正解: A】ユーザーがAPI Gateway経由でメッセージを送信 → LambdaがBedrockのFoundation Model（ClaudeやTitanなど）を呼び出してレスポンスを取得 → DynamoDBに会話履歴を保存し次回のコンテキストとして活用する、サーバーレスAIチャットボットの典型構成です。\n\n【Bが違う理由】BedrockのFoundation Modelをリアルタイムにファインチューニングする機能はありません。Bedrockでのカスタマイズ（Fine-tuning）はバッチ処理として別途実行するものであり、LambdaがDynamoDBのデータをリアルタイムに学習させる構成は存在しません。\n\n【Cが違う理由】BedrockはDynamoDBを直接参照する機能を持ちません。会話履歴のコンテキスト管理はLambdaがDynamoDBから履歴を取得し、プロンプトに組み込んでBedrockに渡す形で実装します。BedrockとDynamoDBは直接接続しません。\n\n【Dが違う理由】DynamoDBはベクトルDBとしての機能を持ちません。RAGのベクトル検索にはOpenSearch ServiceやPostgreSQL（pgvector）などを使います。またこの図にEmbeddingの生成フローは描かれておらず、RAGパイプラインとしての構成とは異なります。'
  },
  {
    id: 58,
    level: 'intermediate',
    diagram: `
[Inspector]
  ↓ (スキャン)
[ECR (コンテナリポジトリ)]
  ↓ (脆弱性レポート)
[Security Hub]
  ↓
[EventBridge]
  ↓
[Lambda (通知・自動修復)]
`,
    question: 'この構成図のユースケースとして最も適切なものはどれか？',
    choices: [
      'A. ECRにプッシュされたコンテナイメージの脆弱性をInspectorがスキャンし、Security Hubで集約・EventBridgeで自動対応するコンテナセキュリティ自動化',
      'B. InspectorがECRへのイメージプッシュをトリガーに自動スキャンを実行し、Critical脆弱性を検出した場合はSecurity HubがそのイメージのECRからの取得（Pull）を直接ブロックする構成',
      'C. Security HubがInspectorのスキャン結果を集約した後、EventBridgeルールの評価対象はSecurity Hubの集約結果ではなくInspectorが直接発行するイベントであるため、Security Hubへの集約とEventBridgeの発火は独立したパスで動作する構成',
      'D. LambdaがInspectorのAPIを定期的にポーリングしてスキャン結果を取得し、結果をECRのイメージタグとしてメタデータに付与した後にSecurity Hubへ集約するバッチ型パイプライン構成'
    ],
    answer: 'A',
    explanation: '【正解: A】Amazon InspectorはECRにプッシュされたコンテナイメージを継続的にスキャンして脆弱性（CVE）を検出します。発見された脆弱性はAWS Security Hubに集約され、EventBridgeルールでイベントを受け取ったLambdaが開発チームへの通知や脆弱性イメージの自動削除などの対応を行うコンテナセキュリティ自動化の構成です。\n\n【Bが違う理由】InspectorはECRへのプッシュをブロックする機能を持ちません。InspectorはスキャンしてSecurity Hubに結果を送るのみです。プッシュをブロックしたい場合はECRのライフサイクルポリシーやCI/CDパイプライン内でのゲートとして実装します。\n\n【Cが違う理由】構成図ではInspector → ECR → Security Hubという流れが描かれています。InspectorのスキャンイベントはECRとの連携を介して検出されるものであり、「ECRを経由せずSecurity Hubに直接送信」という説明は図の構造と一致しません。\n\n【Dが違う理由】InspectorはECRへのプッシュを自動検知してスキャンを実行します（Lambdaからオンデマンドで起動するのは一部のユースケースのみ）。また、スキャン結果をECRのイメージタグとして付与する機能はInspectorにはありません。'
  },
  {
    id: 59,
    level: 'intermediate',
    diagram: `
[MSK (Managed Streaming for Apache Kafka)]
  ↓ (Kafkaトピック)
[Lambda (イベントソースマッピング)]
  ↓
[DynamoDB]
    ↓
[S3 (アーカイブ)]
`,
    question: 'この構成図のユースケースとして最も適切なものはどれか？',
    choices: [
      'A. MSK（マネージドKafka）のトピックをLambdaがコンシュームして処理し、結果をDynamoDBとS3に保存するKafkaベースのストリーム処理基盤',
      'B. MSKのKafkaトピックにメッセージが蓄積されるとLambdaが定期的にバッチポーリングしてDynamoDBに書き込み、DynamoDBのTTL設定によって期限切れレコードが自動的にS3へエクスポートされる構成',
      'C. LambdaのイベントソースマッピングがMSKのトピックパーティションをモニタリングし、パーティション数に応じてLambda関数のコンカレンシーが自動調整されるため、DynamoDBへの書き込みスループットがKafkaのパーティション数に比例してスケールする構成',
      'D. MSKのKafkaトピックをDynamoDB Streamsと連携させることで、DynamoDBへの書き込みをトリガーにKafkaトピックへ変更イベントを自動的に発行し、S3へのアーカイブはそのイベントをLambdaが処理して行う構成'
    ],
    answer: 'A',
    explanation: '【正解: A】AWS MSKはApache KafkaのマネージドサービスでありKafkaトピックにメッセージを蓄積します。LambdaのイベントソースマッピングでMSKトピックをコンシュームし、処理結果をDynamoDB（リアルタイムアクセス用）とS3（長期アーカイブ用）に書き込むストリーム処理の構成です。\n\n【Bが違う理由】構成図の矢印はMSK → Lambdaの方向（コンシュームの向き）を示しています。LambdaがMSKのプロデューサーとして動作するには逆方向の矢印が必要です。LambdaがKafkaにメッセージを送信すること自体は可能ですが、この図の構成とは異なります。\n\n【Cが違う理由】MSKがDynamoDBのChange Data Captureをサブスクライブする機能はありません。DynamoDB StreamsのCDCをKafkaに流すにはLambdaやDebeziumを経由して実装します。また、MSKがS3に直接レプリケートする機能もなく、MSK ConnectやKafka Connectを使います。\n\n【Dが違う理由】選択肢Dは実装上の詳細に関する議論であり、「ユースケースとして最も適切なもの」を問う問題の回答としては不適切です。べき等性の保証はDynamoDBの条件付き書き込みとMSKのオフセット管理を組み合わせることが実際の設計では推奨されます。'
  },
  {
    id: 60,
    level: 'intermediate',
    diagram: `
[Route 53 Resolver (インバウンドエンドポイント)]
  ↓
[VPC (プライベートサブネット)]
  ↓
[Direct Connect]
  ↓
[オンプレミス DNSサーバー]
`,
    question: 'この構成図のユースケースとして最も適切なものはどれか？',
    choices: [
      'A. オンプレミスからVPC内のプライベートホストゾーンをDNS解決するハイブリッドDNS構成',
      'B. Route 53 ResolverがオンプレミスDNSサーバーからゾーントランスファーを受けてVPC内にキャッシュし、Direct ConnectはResolverがオンプレミスに問い合わせる際のバックアップ経路として使用される構成',
      'C. VPC内のEC2インスタンスがRoute 53 Resolverのインバウンドエンドポイントを経由してオンプレミスDNSサーバーに問い合わせを転送し、オンプレミスのプライベートドメインをVPC内から解決する構成',
      'D. Route 53 ResolverのインバウンドエンドポイントはVPC内のIPアドレスを持ち、オンプレミスからDirect Connect経由でそのIPに問い合わせが届くと、ResolverがオンプレミスDNSサーバーへフォワードして名前解決する構成'
    ],
    answer: 'A',
    explanation: '【正解: A】Route 53 ResolverのインバウンドエンドポイントはオンプレミスのDNSサーバーからVPC内のプライベートホストゾーン（例: xxx.internal）を解決するためのエンドポイントです。Direct Connectを経由してオンプレミスのDNSクエリがVPCに届き、Route 53 Resolverが応答するハイブリッドDNS構成の標準パターンです。\n\n【Bが違う理由】Route 53 ResolverはDNSゾーントランスファーを受ける機能を持ちません。ゾーントランスファーはオンプレミスDNS間のゾーン複製に使う仕組みであり、Resolverとは別の概念です。Direct ConnectはResolverのバックアップ経路ではなく、オンプレとVPCを結ぶネットワーク接続です。\n\n【Cが違う理由】VPC内のEC2インスタンスはデフォルトでVPCのDNSリゾルバー（Route 53 Resolver）を使用します。Direct Connectを通じてEC2が直接オンプレミスDNSにクエリを送る構成は通常の設計ではなく、オンプレDNSへの転送はRoute 53 Resolverのアウトバウンドエンドポイントを使います。\n\n【Dが違う理由】インバウンドエンドポイントはVPC内のプライベートIPアドレスを持ちます（パブリックIPではありません）。インターネット経由での解決はRoute 53のパブリックホストゾーンで行うものであり、プライベートDNS解決にインターネット経由は使いません。'
  },
  {
    id: 61,
    level: 'intermediate',
    diagram: `
[Network Firewall]
  ↓
[VPC (パブリックサブネット)]
  ↓
[IGW (Internet Gateway)]
  ↓
[Internet]
`,
    question: 'この構成図のユースケースとして最も適切なものはどれか？',
    choices: [
      'A. VPCからインターネットへの通信をNetwork Firewallでステートフルに検査・フィルタリングする、アウトバウンド防御構成',
      'B. Network FirewallがIGWの代わりにNATゲートウェイとして機能し、プライベートサブネットのEC2がNAT変換なしにインターネットへ接続できる構成',
      'C. VPC内のインバウンドトラフィックをNetwork FirewallがすべてブロックしてIGWを無効化するため、外部からのアクセスが完全に遮断されるゼロトラスト構成',
      'D. Network FirewallをIGWの直後に配置することでインバウンド通信のみを検査し、VPC内からインターネットへのアウトバウンド通信はNetwork Firewallを経由せず直接IGWへ転送される片方向検査構成'
    ],
    answer: 'A',
    explanation: '【正解: A】AWS Network FirewallはVPCのサブネット間に配置するマネージドのネットワーク型ファイアウォールです。ステートフル・ステートレスなルールでアウトバウンドトラフィックを検査し、悪意のあるドメインへの接続やポート制限などを制御するアウトバウンド防御構成として使われます。\n\n【Bが違う理由】Network FirewallはNATゲートウェイとして機能しません。NATとファイアウォールは異なる機能です。プライベートサブネットのインターネットアクセスにはNAT GatewayとNetwork Firewallをそれぞれ別途配置します。\n\n【Cが違う理由】Network Firewallはすべてのトラフィックをブロックするためのものではなく、許可・拒否のルールを細かく設定するものです。IGWを無効化する機能もNetwork Firewallには含まれません。「完全遮断」がしたいならセキュリティグループやNACLで対応します。\n\n【Dが違う理由】Network FirewallはL3〜L4（IPアドレス・ポート・プロトコル）およびL7の一部（ドメイン・SNI）を検査しますが、HTTPヘッダー・SQLインジェクション・XSSなどのWebアプリ層の攻撃はWAFの役割です。Network FirewallがあってもWAFは別途必要であり、「WAFが不要」という説明は誤りです。'
  },
  {
    id: 62,
    level: 'intermediate',
    diagram: `
[Connect (コンタクトセンター)]
  ↓
[Lex (自然言語理解)]
  ↓
[Lambda (バックエンド処理)]
  ↓
[DynamoDB (顧客データ)]
`,
    question: 'この構成図のユースケースとして最も適切なものはどれか？',
    choices: [
      'A. Amazon Connectの音声IVRにLexのチャットボットを統合し、顧客の問い合わせを自動応答するAIコンタクトセンター',
      'B. ConnectがLexを経由せずにLambdaへ直接ルーティングし、LexはDynamoDBの顧客データをもとに通話終了後の満足度スコアを非同期で算出するアフターコール分析構成',
      'C. LexがConnectの通話をリアルタイムで文字起こしし、Lambdaがキーワードを検出してDynamoDBの対応スクリプトを照合することでオペレーターへのリアルタイムアシストを行う支援構成',
      'D. DynamoDBに蓄積された過去の問い合わせログをLambdaが定期的に学習データとしてLexに反映し、ConnectはLexが更新されるたびに自動でコンタクトフローを再デプロイする自動改善構成'
    ],
    answer: 'A',
    explanation: '【正解: A】Amazon ConnectはクラウドベースのコンタクトセンターサービスでありAmazon Lexを統合することで、顧客からの問い合わせを音声/チャットボットで自動対応できます。LambdaでバックエンドのDynamoDBを照会して顧客情報を取得し、パーソナライズされた自動応答を実現するAI活用コンタクトセンターの構成です。\n\n【Bが違う理由】Lexは自然言語理解（NLU）のサービスであり、音声の文字起こし（Transcribe）や感情分析（Comprehend）は別のAWSサービスの役割です。また通話録音の文字起こしはAmazon Transcribeが担い、Lexはその役割を持ちません。\n\n【Cが違う理由】この構成がエスカレーション専用と断言することはできません。Connectの問い合わせフローはLexで自動応答→解決できない場合はオペレーターへエスカレーションという設計が一般的ですが、それは「エスカレーション専用」ではなく「自動応答＋エスカレーション」の構成です。ユースケースの説明として過度に限定的です。\n\n【Dが違う理由】LexはDynamoDBのデータをConnectの音声合成エンジンに「直接渡す」機能を持ちません。Lexのフルフィルメント用のLambdaがDynamoDBからデータを取得し、Lexの応答テキストを構築してConnectに返します。データの流れが図の矢印の向きと一致しません。'
  },
  {
    id: 63,
    level: 'intermediate',
    diagram: `
[Pinpoint (セグメント・キャンペーン管理)]
  ↓
[SES (メール送信)]
  ↓ (バウンス・開封・クリックイベント)
[Kinesis Data Streams]
  ↓
[Lambda]
  ↓
[DynamoDB (エンゲージメントデータ)]
`,
    question: 'この構成図のユースケースとして最も適切なものはどれか？',
    choices: [
      'A. Pinpointでセグメント配信し、SESのメールエンゲージメントイベントをKinesisで収集・Lambdaで分析するマーケティングメール基盤',
      'B. SESのバウンス・開封・クリックイベントをKinesisがリアルタイムに集約し、LambdaがそのデータをDynamoDBに書き込むとともにPinpointのセグメント条件を自動更新してキャンペーン配信対象を動的に絞り込む自動最適化構成',
      'C. KinesisがPinpointのキャンペーンスケジューラーとして機能し、DynamoDBのエンゲージメントスコアに応じてLambdaが送信タイミングをリアルタイムに調整してSESへ配信指示を出す送信制御構成',
      'D. PinpointがLambdaを通じてSESの送信枠（クォータ）をDynamoDBの履歴データに基づいて動的に割り当て、KinesisはSESからのバウンス通知を受け取りPinpointのエンドポイント抑止リストへ直接反映する構成'
    ],
    answer: 'A',
    explanation: '【正解: A】Amazon Pinpointはユーザーセグメンテーションとマーケティングキャンペーンの管理サービスです。SESでメールを配信し、開封・クリック・バウンスなどのエンゲージメントイベントをKinesis Data Streamsで受け取り、Lambdaで処理してDynamoDBにエンゲージメントデータを蓄積するマーケティングメール基盤の構成です。\n\n【Bが違う理由】SESがKinesis経由でPinpointのキャンペーンデータをDynamoDBに同期する機能はありません。データの流れはPinpoint→SES（送信）→KinesisへのイベントプッシュというSESからKinesisへの方向です。LambdaがPinpointのセグメントを動的更新することは可能ですが、それはDynamoDBのデータを元にLambdaが呼び出す別フローです。\n\n【Cが違う理由】KinesisはSESの「送信キュー」ではありません。Kinesis Data StreamsはSESが配信後に発生するエンゲージメントイベント（開封・クリック・バウンス）を受け取るためのものです。送信キューとしてはSQSを使います。\n\n【Dが違う理由】構成図ではSESのイベント（バウンス・開封・クリック）はKinesis Data Streamsに送られると描かれており、「Kinesisを経由せず直接Pinpointにバウンス情報を返す」という説明は図の構造と異なります。SESのバウンス情報処理はSNS・Kinesis・SQSなどを経由するのが一般的です。'
  },
  {
    id: 64,
    level: 'intermediate',
    diagram: `
[S3 (元データ)]
  ↓
[S3 Object Lambda (アクセスポイント)]
  ↓ (オンザフライ変換)
[Lambda (変換ロジック)]
  ↓
[クライアント (変換済みデータ)]
`,
    question: 'この構成図のユースケースとして最も適切なものはどれか？',
    choices: [
      'A. S3のオブジェクトを取得するリクエストをインターセプトし、Lambdaでオンザフライに変換・フィルタリングしてクライアントに返す構成',
      'B. LambdaがS3の元データを取得して変換処理を行い、変換済みデータを別のS3バケットに書き込んだ後クライアントがS3 Object Lambdaアクセスポイント経由で取得する2段階処理構成',
      'C. S3 Object LambdaアクセスポイントがLambdaの変換ロジックをキャッシュし、同一オブジェクトへの2回目以降のリクエストではLambdaを呼び出さずキャッシュ済みの変換結果を直接クライアントへ返す構成',
      'D. LambdaがS3のイベント通知をトリガーにオブジェクト書き込み時点で変換処理を実行し、S3 Object Lambdaアクセスポイントはクライアントへの配信エンドポイントとして変換済みオブジェクトへのリダイレクトのみを担う構成'
    ],
    answer: 'A',
    explanation: '【正解: A】S3 Object Lambdaは、クライアントがS3からオブジェクトをGETするリクエストをS3 Object Lambdaアクセスポイントが受け取り、Lambdaを呼び出してオンザフライでデータを変換（マスキング・フォーマット変換・圧縮解凍など）してからクライアントに返す機能です。元のS3バケットのデータを変更せずに複数の形式を提供できます。\n\n【Bが違う理由】S3 Object Lambdaは「GETリクエスト時にリアルタイムで変換してクライアントに返す」機能であり、変換済みデータを別のバケットに書き込むフローは含まれません。別バケットへの書き込みが必要な場合はS3イベント + Lambdaの構成を使います。\n\n【Cが違う理由】S3 Object LambdaはS3のデフォルト暗号化を上書きする機能を持ちません。S3の暗号化（SSE-S3、SSE-KMS、SSE-C）は書き込み時に設定するものです。クライアントごとに異なる暗号化アルゴリズムを適用することもObject Lambdaの用途ではありません。\n\n【Dが違う理由】S3 Object LambdaはCDNではなくS3のアクセスポイント機能の拡張です。全オブジェクトをバッチスキャンする処理はObject Lambdaのトリガーモデル（GETリクエスト単位）とは異なります。CDN的な配信速度最適化はCloudFrontの役割です。'
  },
  {
    id: 65,
    level: 'intermediate',
    diagram: `
[MediaLive (ライブ動画エンコード)]
  ↓
[MediaPackage (パッケージング・DRM)]
  ↓
[CloudFront (グローバル配信)]
  ↓
[視聴者]
`,
    question: 'この構成図のユースケースとして最も適切なものはどれか？',
    choices: [
      'A. ライブ映像をクラウドでエンコード・パッケージングしてCloudFrontからグローバルに配信するライブストリーミング基盤',
      'B. MediaLiveがHLSセグメントを生成してMediaPackageに送信し、MediaPackageはDRMを適用せずCloudFrontのフィールドレベル暗号化に暗号化処理を委譲することで視聴者ごとに異なる復号鍵を配布する構成',
      'C. CloudFrontがMediaPackageのオリジンサーバーとしてHLSセグメントをキャッシュし、MediaLiveは視聴者数に応じてビットレートを動的に切り替えるABRエンコードのみを担う構成',
      'D. MediaPackageのDRMがCloudFrontのキャッシュポリシーと連携して動作するため、DRM保護されたコンテンツはCloudFrontにキャッシュされず毎回MediaPackageから直接視聴者へ配信される構成'
    ],
    answer: 'A',
    explanation: '【正解: A】AWS MediaLiveはライブ映像ソース（カメラ・エンコーダー）を受け取りH.264/H.265にエンコードするサービスです。MediaPackageがHLS・DASH・CMFのパッケージングとDRM保護を行い、CloudFrontがエッジから世界中の視聴者にストリームを低レイテンシで配信するライブストリーミング基盤の標準構成です。\n\n【Bが違う理由】MediaLiveは動画のフレーム分析機能を持ちません。映像の内容分析にはRekognition Videoを使います。また、EPG（電子番組表）の配信はMediaPackageの主要機能ではありません。\n\n【Cが違う理由】CloudFrontはMediaPackageのオリジンに接続してHLSセグメントを配信しますが、「CloudFrontがMediaPackageのオリジンサーバーとして機能する」という説明は逆です（CloudFrontがクライアントに近い側で、MediaPackageがオリジン側）。また、MediaLiveはABRのマルチビットレートエンコードを担いますが、「視聴者数に応じて動的に切り替える」のはABR再生プレイヤー側の処理です。\n\n【Dが違う理由】MediaPackageのDRMとCloudFrontのフィールドレベル暗号化は別の機能です。CloudFrontのフィールドレベル暗号化は特定のHTTPフォームフィールドを暗号化する機能であり、DRMとは直接連携しません。また、CloudFrontにキャッシュがある場合は視聴者はCloudFrontから取得するのが通常の動作です。'
  },

  // ---- ADVANCED 66〜70 ----
  {
    id: 66,
    level: 'advanced',
    diagram: `
[AWS Organizations]
  ↓ (SCP適用)
[複数メンバーアカウント]
  ↓
[Config (全アカウント)]
  ↓ (ルール評価)
[Security Hub (集約)]
  ↓
[EventBridge]
  ↓
[Lambda (自動修復)]
`,
    question: 'この構成図のユースケースとして最も適切なものはどれか？',
    choices: [
      'A. OrganizationsのSCPでガードレールを設定し、ConfigとSecurity Hubで全アカウントのコンプライアンスを自動監視・修復するマルチアカウントガバナンス基盤',
      'B. ConfigのルールがSCPのポリシー条件として各メンバーアカウントに動的に適用され、違反が検知されるとSecurity HubがEventBridgeを通じてOrganizationsのアカウントタグを自動更新しLambdaがSCPのアタッチ先を切り替える構成',
      'C. Security HubがConfigの評価結果を集約した後にEventBridgeでLambdaを起動し、LambdaがOrganizationsのSCPを書き換えることで違反リソースをリアルタイムに制御するポリシー自動更新構成',
      'D. LambdaがOrganizationsのAPIを直接呼び出してSCPを更新し、ConfigとSecurity Hubは修復後のコンプライアンス確認のみを担う構成'
    ],
    answer: 'A',
    explanation: '【正解: A】AWS OrganizationsのSCP（Service Control Policy）で各アカウントでの操作を制限するガードレールを設定し、AWS Configの組織レベルのコンプライアンスルールで各アカウントの設定違反を検知、AWS Security Hubで全アカウントの発見事項を一元集約、EventBridgeでイベントを受け取りLambdaで自動修復（セキュリティグループの修正・リソース削除など）を行うマルチアカウントガバナンスの標準構成です。\n\n【Bが違う理由】SCPはConfigのルール評価結果を参照する機能を持ちません。SCPはIAMポリシーに似た予防的コントロール（事前に禁止する）であり、ConfigはリアクティブなコントロールMechanism（事後に検知する）です。また、SCPがアカウントを「自動停止」することはできません。\n\n【Cが違う理由】ConfigのルールをSCPとしてデプロイすることはできません。SCPとConfigルールは別の仕組みです。Security HubがEventBridgeのルールを動的に追加する機能もなく、「自己進化型」という説明は実際のAWSサービスの動作とは異なります。\n\n【Dが違う理由】LambdaがOrganizationsのAPIを呼び出してSCPを更新することは技術的には可能ですが、セキュリティ上のリスクが高く推奨されません。またConfigとSecurity Hubは「確認のみ」ではなく、継続的な監視・検知の中核を担います。この選択肢の説明は図の構成が示す役割分担と一致しません。'
  },
  {
    id: 67,
    level: 'advanced',
    diagram: `
[CloudFormation StackSets]
  ↓ (Organizations統合)
[複数リージョン × 複数アカウント]
  ↓
[Config (コンプライアンスルール)]
  ↓
[SSM Parameter Store (設定値)]
  ↓
[CodePipeline (デプロイ自動化)]
`,
    question: 'この構成図のユースケースとして最も適切なものはどれか？',
    choices: [
      'A. StackSetsで複数アカウント・リージョンにインフラを一括デプロイし、Config・SSMパラメータ・CodePipelineで設定管理とデプロイを自動化するマルチアカウントIaC基盤',
      'B. ConfigがStackSetsのテンプレートをスキャンしてIaCの記述ミスをデプロイ前に検証し、SSM Parameter StoreがCloudFormationの変数として動的に値を注入するビルドタイム検証構成',
      'C. StackSetsが全アカウントにCodePipelineをデプロイし、各アカウントのCodePipelineがSSM Parameter Storeの設定値を参照してローカルにインフラを構築するため、Configはアカウントをまたいだ差分のみをOrganizationsの管理アカウントに集約する構成',
      'D. Organizations統合により、StackSetsが新規アカウントを自動検出して全サービスのデプロイをトリガーし、CodePipelineはConfigの評価結果を承認条件として使用するゲーテッドデプロイ構成'
    ],
    answer: 'A',
    explanation: '【正解: A】AWS CloudFormation StackSetsはOrganizations統合により複数のAWSアカウントと複数リージョンに対して単一のCloudFormationテンプレートを一括デプロイできます。Configでコンプライアンスルールを展開し、SSM Parameter StoreでアカウントごとのパラメータをIaCから参照可能にし、CodePipelineでデプロイを自動化するエンタープライズ向けのマルチアカウントIaC基盤です。\n\n【Bが違う理由】ConfigはIaCテンプレートの記述ミスをデプロイ前に静的解析する機能を持ちません。IaCの事前検証にはCFN Guard・cfn-lint・CloudFormation Linterを使います。ConfigはデプロイされたAWSリソースの設定を継続的に評価するサービスです。\n\n【Cが違う理由】CodePipelineがStackSetsの実行ロールを引き受けることは可能ですが、SSM Parameter StoreとConfigを「ドリフト検知にのみ使用」という限定は不正確です。両サービスはデプロイ前後を通じた継続的なコンプライアンス管理と設定管理に使われます。\n\n【Dが違う理由】StackSetsはOrganizations統合で新規アカウントを自動検出してデプロイする機能（自動デプロイ）を持ちますが、「全サービスのデプロイをトリガー」というのは過大な説明です。またCodePipelineがConfigの評価結果を直接承認条件として使用する統合機能は標準では存在せず、Lambdaなどを介したカスタム実装が必要です。'
  },
  {
    id: 68,
    level: 'advanced',
    diagram: `
[Snow Family (Snowball Edge)]
  ↓ (物理デバイス輸送)
[S3 (インポートデータ)]
  ↓
[Glue (ETL変換)]
  ↓
[Redshift (DWH)]
  ↓
[QuickSight (BI・可視化)]
`,
    question: 'この構成図のユースケースとして最も適切なものはどれか？',
    choices: [
      'A. ネットワーク帯域が不足する環境から大量データをSnowball Edgeで物理転送しS3に取り込み、GlueでETL後RedshiftとQuickSightで分析するデータ移行・分析基盤',
      'B. Snowball EdgeがS3へのリアルタイムデータストリーミングを行い、GlueがSnowball上でETL変換を完了させたデータのみをRedshiftにロードしてQuickSightで差分更新するインクリメンタル分析構成',
      'C. GlueがSnowball Edgeから取り込んだS3データをRedshiftのステージングテーブルにそのままロードし、QuickSightがRedshift上でETLと可視化を同時に処理するため別途Glue変換ジョブは不要となる構成',
      'D. Snowball Edgeが現地でGlueのETL処理をローカル実行してからS3にアップロードすることで、クラウド側のGlueジョブは不要となり、Redshiftは変換済みデータを受け取ってQuickSightに直接ストリーミングする構成'
    ],
    answer: 'A',
    explanation: '【正解: A】AWS Snow Familyは数十TB〜PBクラスの大量データをインターネット転送ではなく物理デバイスの輸送で移行するサービスです。Snowball Edgeにデータをロードして輸送→AWSがS3にインポート→Glueでデータ変換・クレンジング→RedshiftにロードしてDWHを構築→QuickSightでBIダッシュボードを作成するデータ移行・分析基盤のユースケースです。\n\n【Bが違う理由】Snowball Edgeはリアルタイムストリーミングのデバイスではありません。Snowball Edgeはバッチでのデータ収集・転送に使うデバイスであり、S3へのリアルタイムストリーミングには適しません。また「GlueがSnowball上でETL変換を完了させる」という説明も、通常のGlueジョブはAWSクラウド上で動作するものです（Snowball EdgeのIoT Greengrass機能を使えば一部処理は可能ですが、標準的な構成ではありません）。\n\n【Cが違う理由】GlueはS3とSnowball Edge間の双方向同期を管理する機能を持ちません。Glueはデータカタログ管理とETLジョブ実行のサービスです。RedshiftのFederated Query機能は実在しますが（RDS・Aurora・S3への接続）、Snowball EdgeのデータをRedshiftがリアルタイムにクエリする機能はありません。\n\n【Dが違う理由】QuickSightはSnowball EdgeのローカルWi-Fi経由でRedshiftに接続することはできません。Snowball EdgeはAWSのデータセンターに輸送された後S3にデータがインポートされるデバイスです。エッジでBI処理する構成はSnowball Edgeの主要ユースケースではありません。'
  },
  {
    id: 69,
    level: 'advanced',
    diagram: `
[Outposts (オンプレミス設置のAWSラック)]
  ↓
[VPC サブネット (on Outposts)]
  ↓
[ECS / RDS on Outposts]
  ↓ (VPN / Direct Connect)
[AWS リージョン (S3 / Control Plane)]
`,
    question: 'この構成図のユースケースとして最も適切なものはどれか？',
    choices: [
      'A. データ主権・低レイテンシ要件のためにオンプレミスでAWSインフラを稼働させ、リージョンとのハイブリッド接続を維持するOutposts構成',
      'B. OutpostsがVPC拡張サブネットとして機能し、リージョン側のECSコントロールプレーンからタスク配置の指示を受けてオンプレミスで実行するため、Direct Connect / VPNはECSタスクのデータプレーン通信にのみ使用される構成',
      'C. ECSとRDSのデータプレーンはOutposts上でローカルに動作するが、コントロールプレーンはAWSリージョンに依存しているため、Direct Connect / VPNが切断されるとタスクのスケジューリングやDBの管理操作が行えなくなる構成',
      'D. OutpostsのVPCサブネットがリージョンのVPCと同一のCIDRを共有し、ECSタスクがS3に書き込む際はOutposts上のS3ローカルエンドポイントを経由するためレイテンシが最小化される構成'
    ],
    answer: 'A',
    explanation: '【正解: A】AWS OutpostsはオンプレミスのデータセンターにAWSのラック（Outposts rack / server）を設置し、EC2・ECS・RDS・S3などのAWSサービスをオンプレで稼働させるサービスです。データ主権（規制でデータをオンプレに留める必要がある場合）や超低レイテンシ（工場・病院など）の要件を満たしながら、VPN/Direct Connect経由でリージョンのS3（オブジェクトストレージ）やControl Planeと連携するハイブリッド構成です。\n\n【Bが違う理由】OutpostsはVMwareクラスターを自動検出してECSタスクに変換する機能を持ちません。VMwareからのコンテナ移行にはApp2ContainerやAWS Migration Hubを使います。また「ECSタスクに変換してS3に継続レプリケート」というフローも存在しません。\n\n【Cが違う理由】OutpostsのECSやRDSのControl PlaneはAWSリージョンと通信することを前提としています。Direct Connect / VPNが切断された場合、OutpostsはLocal Gatewayを通じたローカル通信は継続できますが、新しいインスタンス起動やAPIオペレーションなどリージョンのControl Planeに依存する操作は行えません。「完全な自律運転が可能」という説明は誤りです。\n\n【Dが違う理由】OutpostsのVPCサブネットとリージョンのVPCは同一のCIDRを共有しません（CIDRは分離されます）。S3 on Outpostsは別途設定が必要であり、リージョンのS3とは異なるエンドポイントです。ECSタスクがリージョンS3に書き込む場合はDirect Connect / VPN経由となりOutposts上のS3エンドポイントではありません。'
  },
  {
    id: 70,
    level: 'advanced',
    diagram: `
[ALB]
  ↓
[ECS Fargate (アプリ)]
  ↓
[X-Ray (分散トレース)]
  ↓
[CloudWatch Container Insights]
  ↓
[CloudWatch Dashboards / Alarms]
  ↓
[SNS → Lambda (自動スケーリング・通知)]
`,
    question: 'この構成図のユースケースとして最も適切なものはどれか？',
    choices: [
      'A. ECS Fargateコンテナの分散トレース・メトリクス監視・自動アラート通知を統合したコンテナ可観測性（Observability）基盤',
      'B. X-RayがALBのアクセスログをリアルタイムで解析してCloudWatch Container Insightsのメトリクスを生成し、CloudWatch DashboardsがFargateのタスク数を直接制御するオートスケーリング構成',
      'C. CloudWatch Container InsightsがX-Rayのトレースデータを集約してアプリケーションのボトルネックを特定し、SNSがLambdaを起動してECS Fargateのタスク定義を書き換えることで障害箇所を自動的に切り離すサーキットブレーカー構成',
      'D. LambdaがCloudWatch Dashboardsのウィジェットを動的に更新してX-Rayのトレースデータを可視化し、SNSがALBのリスナールールを変更してFargateへのトラフィックをリアルタイムに制御する構成'
    ],
    answer: 'A',
    explanation: '【正解: A】ALBからのリクエストをECS Fargateで受け、X-Rayサイドカーで各コンテナの処理をトレース、CloudWatch Container InsightsでCPU・メモリ・ネットワークなどのコンテナメトリクスを収集、CloudWatch DashboardsとAlarmsで可視化・閾値監視、アラーム発火時にSNSがLambdaを呼び出して自動スケーリング指示や通知を行うコンテナの可観測性（Observability）基盤です。\n\n【Bが違う理由】X-RayはALBのアクセスログを解析する機能を持ちません。X-RayはアプリケーションコードにSDKを組み込むことでトレースデータを収集します。またCloudWatch DashboardsはFargateのタスク数を直接制御する機能を持ちません。タスク数の制御はECS Auto ScalingやApplication Auto Scalingが担います。\n\n【Cが違う理由】CloudWatch Container InsightsがX-Rayのサイドカーコンテナを自動デプロイする機能はありません。X-Rayサイドカーの設定はECSのタスク定義に手動または IaC で設定します。またSNSはLambdaとCloudWatch Alarmsを「同期的に起動」するのではなく、非同期で通知を発行するサービスです。\n\n【Dが違う理由】LambdaがCloudWatch Dashboardsのウィジェットを動的に更新することは可能ですが、それはこの構成の主要な目的ではありません。またSNSがALBのリスナールールを直接変更する機能はなく、そのような操作にはLambdaからELB APIを呼び出す必要があります。トラフィック制御をSNS起点で行う設計は通常取りません。'
  },

  // ============================================================
  // BASIC追加（問71〜90）: シンプルな2〜3サービス構成・答えA/B/C/D均等配分
  // ============================================================
  {
    id: 71,
    level: 'basic',
    diagram: `
[Application (EC2)]
    ↓
[RDS Primary (AZ-a)]
    ↓ (同期レプリケーション)
[RDS Standby (AZ-b)]
    ↑ (自動フェイルオーバー)
`,
    question: 'この構成図のユースケースとして最も適切なものはどれか？',
    choices: [
      'A. RDS Multi-AZによるデータベースの自動フェイルオーバーと高可用性確保',
      'B. RDS StandbyをRead Replicaとして活用し、読み取り負荷をAZ-bに分散する読み取りスケールアウト構成',
      'C. RDS PrimaryとStandbyを両方アクティブにしてアプリケーションが並列書き込みすることで、スループットを2倍にするアクティブ-アクティブ構成',
      'D. AZ-aで障害が発生した際にEC2がAZ-bのStandbyに直接接続先を切り替え、アプリケーション側でフェイルオーバーを制御する構成'
    ],
    answer: 'A',
    explanation: '【正解: A】RDS Multi-AZはプライマリからスタンバイへの同期レプリケーションにより、AZ障害・メンテナンス時に自動フェイルオーバーしてダウンタイムを最小化する高可用性構成です。\n\n【Bが違う理由】Multi-AZのスタンバイインスタンスは読み取りエンドポイントを持たず、通常はRead Replicaとして使用できません。読み取り分散にはMulti-AZとは別にRead Replicaを作成する必要があります。\n\n【Cが違う理由】Multi-AZはアクティブ-スタンバイ構成であり、スタンバイへの直接書き込みはできません。両方にアクティブ書き込みするアクティブ-アクティブ構成はAurora Global Databaseなど別のサービスで実現します。\n\n【Dが違う理由】Multi-AZのフェイルオーバーはDNSエンドポイントの切り替えによりAWSが自動で行います。アプリケーション側での接続先切り替えは不要であり、エンドポイントURLは変わりません。'
  },
  {
    id: 72,
    level: 'basic',
    diagram: `
[Developer]
    ↓ (docker build & push)
[ECR (Elastic Container Registry)]
    ↓ (イメージpull)
[ECS Fargate]
    ↓
[コンテナアプリ実行]
`,
    question: 'この構成図のユースケースとして最も適切なものはどれか？',
    choices: [
      'A. ECRがDockerfileをビルドしてFargateに自動デプロイするサーバーレスCI/CD構成',
      'B. コンテナイメージをECRで一元管理し、Fargateでサーバーレスにコンテナを実行する構成',
      'C. FargateがECRのリポジトリを監視し、新しいイメージがプッシュされると自動的にローリングアップデートを実行する構成',
      'D. ECRがDockerイメージをS3にエクスポートし、FargateがS3からイメージを直接ロードして起動する構成'
    ],
    answer: 'B',
    explanation: '【正解: B】開発者がdocker buildしたイメージをECR（プライベートなコンテナレジストリ）にpushし、ECS Fargateがそのイメージをpullしてサーバーレスでコンテナを実行するのが基本的なコンテナデプロイ構成です。\n\n【Aが違う理由】ECR自体にDockerfileのビルド機能はありません。ビルドはローカル環境やCodeBuildなどのCI/CDサービスが担います。ECRはビルド済みイメージの保存・配布が役割です。\n\n【Cが違う理由】FargateはECRのリポジトリを常時監視して自動ローリングアップデートする機能を持ちません。デプロイの自動化にはCodePipelineやGitHub Actionsなど別途CI/CDの仕組みが必要です。\n\n【Dが違う理由】ECRはS3を中間ストレージとして使わず、FargateはECRから直接イメージをpullします。S3をコンテナイメージの配布経路として使う構成は存在しません。'
  },
  {
    id: 73,
    level: 'basic',
    diagram: `
[EC2 (プライベートサブネット)]
    ↓
[NAT Gateway (パブリックサブネット)]
    ↓
[Internet Gateway]
    ↓
[Internet (外部API・パッケージ取得等)]
`,
    question: 'この構成図のユースケースとして最も適切なものはどれか？',
    choices: [
      'A. インターネットからEC2へのインバウンド通信を制御するためにNAT Gatewayをリバースプロキシとして配置する構成',
      'B. NAT GatewayがEC2のパブリックIPを固定し、外部サービスからのインバウンドアクセスを受け付けるフロントエンド構成',
      'C. プライベートサブネットのEC2がインターネットへアウトバウンド通信するための構成',
      'D. NAT Gatewayがプライベートサブネット内のEC2間通信を中継し、VPC内のトラフィックを一元管理する構成'
    ],
    answer: 'C',
    explanation: '【正解: C】プライベートサブネットのEC2はパブリックIPを持たないため、インターネットへの直接アクセスができません。NAT GatewayはプライベートサブネットのEC2がパッケージのダウンロードや外部API呼び出しなどアウトバウンド通信を行うための出口として機能します。\n\n【Aが違う理由】NAT GatewayはアウトバウンドNATであり、インバウンド通信のリバースプロキシとしては機能しません。インバウンドの制御はセキュリティグループやNACL、ALBが担います。\n\n【Bが違う理由】NAT GatewayはElastic IPを持ちますが、それはアウトバウンド通信の送信元IPとして使われるものです。インターネットからNAT Gatewayを経由してEC2へのインバウンドアクセスは受け付けられません。\n\n【Dが違う理由】NAT GatewayはVPC内のEC2間通信を中継する機能を持ちません。EC2間の通信はVPCのルーティングで直接行われます。NAT GatewayはあくまでVPC外（インターネット）へのアウトバウンド専用です。'
  },
  {
    id: 74,
    level: 'basic',
    diagram: `
[S3 (レポートPDF生成完了)]
    ↓ (PutObjectイベント)
[Lambda]
    ↓
[SES (Simple Email Service)]
    ↓
[受信者 (メール受信)]
`,
    question: 'この構成図のユースケースとして最も適切なものはどれか？',
    choices: [
      'A. LambdaがS3のレポートファイルを定期的にポーリングし、SESを使って毎日定刻に全ユーザーへ一括メール配信する構成',
      'B. SESが受信メールをS3に保存し、PutObjectイベントでLambdaを起動して受信内容を解析・自動返信する構成',
      'C. S3にレポートがアップロードされるたびにLambdaがSESを直接呼び出して送信するが、SESのバウンス処理はS3の別バケットにLambdaが書き込む構成',
      'D. S3へのファイル保存を契機にLambdaがSES経由でメールを自動送信するイベント駆動通知構成'
    ],
    answer: 'D',
    explanation: '【正解: D】S3のPutObjectイベント→Lambdaトリガー→SESでメール送信という流れは、ファイル生成・アップロード完了をユーザーへメール通知する典型的なイベント駆動構成です。\n\n【Aが違う理由】LambdaがS3をポーリングする仕組みは存在しません。S3イベントはLambdaへのプッシュ型トリガーです。また定刻配信にはEventBridge Schedulerなど別のスケジューリング機構が必要です。\n\n【Bが違う理由】矢印の方向が逆です。この構成図ではS3→Lambda→SESという送信方向を示しており、SESが受信メールをS3に保存する受信フローとは異なります。\n\n【Cが違う理由】SESのバウンス処理はSES自身がSNSやSQSへのイベント通知で管理するものであり、LambdaがS3に書き込むという説明は構成図に存在しない要素です。図の構成はシンプルな送信フローです。'
  },
  {
    id: 75,
    level: 'basic',
    diagram: `
[User]
    ↓ (HTTPS)
[CloudFront]
    ↓ (OAC: Origin Access Control)
[S3 Bucket (パブリックアクセス無効)]
`,
    question: 'この構成図のユースケースとして最も適切なものはどれか？',
    choices: [
      'A. S3バケットをパブリックに公開したまま、CloudFrontでHTTPS化と地理的制限だけを付加する構成',
      'B. CloudFrontを経由した場合のみS3コンテンツにアクセスできるよう、OACでS3バケットをプライベートに保つセキュアな静的配信構成',
      'C. OACがユーザーのCognito認証トークンを検証し、認証済みユーザーのみS3からコンテンツをダウンロードできるアクセス制御構成',
      'D. CloudFrontがS3に接続できなかった場合にOACがフォールバックとして別リージョンのS3バケットに自動切り替えするフェイルオーバー構成'
    ],
    answer: 'B',
    explanation: '【正解: B】OAC（Origin Access Control）を使うとCloudFrontのみがS3にアクセスできる署名付きリクエストを送れるようになり、S3バケットをパブリックに開けることなく安全にコンテンツを配信できます。\n\n【Aが違う理由】OACの目的はS3をパブリックに開かずに保護することです。「S3バケットをパブリックに公開したまま」では、CloudFrontをバイパスしたS3直接アクセスが可能になりセキュリティ上問題があります。\n\n【Cが違う理由】OACはCloudFrontとS3間の認証（CloudFrontがS3にアクセスするための仕組み）であり、エンドユーザーのCognito認証トークンを検証する機能ではありません。ユーザー認証にはCloudFrontの署名付きURLやCookieを別途使います。\n\n【Dが違う理由】OACにはフェイルオーバー機能はありません。CloudFrontのオリジンフェイルオーバーは別途オリジングループの設定で実現するものです。'
  },
  {
    id: 76,
    level: 'basic',
    diagram: `
[S3 Standard]
    ↓ (30日経過: ライフサイクルポリシー)
[S3 Standard-IA]
    ↓ (90日経過: ライフサイクルポリシー)
[S3 Glacier Flexible Retrieval]
`,
    question: 'この構成図のユースケースとして最も適切なものはどれか？',
    choices: [
      'A. S3 Standard・Standard-IA・Glacierに同じデータを3重に複製し、ストレージ障害に備えた多重バックアップ構成',
      'B. S3ライフサイクルポリシーで経過日数に応じて低コストのストレージクラスへ自動移行するデータアーカイブ構成',
      'C. アプリケーションが頻度に応じてS3 Standard・Standard-IA・Glacierを明示的に選択してオブジェクトを書き込む手動コスト最適化構成',
      'D. S3 GlacierがStandard-IAを経由せずS3 Standardに直接書き戻し、アーカイブデータをリアルタイムに更新する構成'
    ],
    answer: 'B',
    explanation: '【正解: B】S3ライフサイクルポリシーを使うと、オブジェクト作成から指定日数が経過した時点で自動的にS3 Standard → Standard-IA（低頻度アクセス）→ Glacierへとストレージクラスを移行できます。アクセス頻度が下がるにつれてコストを削減しながらデータを長期保存できます。\n\n【Aが違う理由】この構成は同じデータの3重複製ではなく、1つのオブジェクトが時間経過に伴い順に移行することを示しています。S3はリージョン内で自動的に複数AZに複製するためこのような多重化は不要です。\n\n【Cが違う理由】ライフサイクルポリシーはAWSが自動で移行を行うものであり、アプリケーション側での明示的な選択は不要です。構成図の矢印は自動移行を示しています。\n\n【Dが違う理由】ライフサイクルポリシーの移行方向はStandard→より低コストのクラスへの一方向です。GlacierからStandardへの書き戻しはRestoreオペレーションで行われる別の操作であり、自動化されていません。'
  },
  {
    id: 77,
    level: 'basic',
    diagram: `
[IAM Role (EC2にアタッチ)]
    ↓ (AssumeRole: 一時クレデンシャル発行)
[EC2 (Webアプリ)]
    ↓ (一時クレデンシャルを使用)
[S3 / DynamoDB / その他AWSサービス]
`,
    question: 'この構成図のユースケースとして最も適切なものはどれか？',
    choices: [
      'A. EC2インスタンスプロファイル経由でIAM Roleを使い、アクセスキーをハードコードせずにAWSサービスへアクセスする構成',
      'B. IAM Roleがアクセスキー・シークレットキーのペアを生成してEC2の環境変数に自動注入し、アプリケーションがそれを読み取る構成',
      'C. EC2がIAM Roleを使うにはSTS APIを明示的に呼び出すコードをアプリケーションに実装する必要があり、SDKでは自動取得できない',
      'D. IAM Roleの一時クレデンシャルは24時間有効で自動更新されず、期限切れ時はEC2の再起動が必要になる構成'
    ],
    answer: 'A',
    explanation: '【正解: A】EC2にIAM Role（インスタンスプロファイル）をアタッチすると、EC2メタデータサービス（IMDS）経由で一時クレデンシャルを自動取得できます。アクセスキーをコードや環境変数にハードコードする必要がなく、セキュアにAWSサービスへアクセスできます。\n\n【Bが違う理由】IAM Roleはアクセスキーのペアを環境変数に自動注入しません。一時クレデンシャルはIMDS（169.254.169.254）から取得されます。AWS SDKは自動でIMDSを参照するため、アプリケーション側の特別な実装は不要です。\n\n【Cが違う理由】AWS SDKはIAM Role（インスタンスプロファイル）の一時クレデンシャルをIMDSから自動取得します。アプリケーション内でSTS APIを明示的に呼び出すコードは不要です。\n\n【Dが違う理由】IAM Roleの一時クレデンシャルは有効期限前に自動更新されます。EC2の再起動は不要であり、ロールの有効期限はデフォルトで1時間ですが、期限切れ前にSDKが自動で新しいクレデンシャルを取得します。'
  },
  {
    id: 78,
    level: 'basic',
    diagram: `
[AWSアカウント全体のAPI操作]
    ↓ (自動記録)
[CloudTrail (証跡)]
    ↓
[S3 Bucket (ログ長期保存)]
    ↓ (異常検知時)
[CloudWatch Alarms → SNS通知]
`,
    question: 'この構成図のユースケースとして最も適切なものはどれか？',
    choices: [
      'A. EC2のCPU・メモリ使用率をCloudTrailが収集してS3に保存し、CloudWatch AlarmsがS3のデータを直接分析してSNSで通知する構成',
      'B. CloudTrailがS3へのオブジェクトアクセスログのみを記録し、CloudWatchがS3のストレージ使用量を監視してSNSでアラートを送る構成',
      'C. SNSがCloudWatchのアラームを受け取り、CloudTrailを通じてS3バケットへのルートアカウント操作を自動的に禁止する構成',
      'D. AWSの操作ログをCloudTrailで記録・S3に保存し、不審な操作を検知したらSNSでアラートする監査証跡構成'
    ],
    answer: 'D',
    explanation: '【正解: D】CloudTrailはAWSアカウント内のすべてのAPI呼び出し（Console・CLI・SDK）を記録します。ログをS3に長期保存し、CloudWatch Logsへの転送と組み合わせてアラームを設定することで、不審な操作（ルートアカウント使用・IAMポリシー変更等）を検知してSNSで通知する監査構成の定石です。\n\n【Aが違う理由】CloudTrailが収集するのはAPIの操作ログであり、CPU・メモリ使用率などのリソースメトリクスではありません。メトリクス収集はCloudWatch Metricsが担います。\n\n【Bが違う理由】CloudTrailはS3へのオブジェクトアクセスログだけでなく、AWSアカウント全体のAPI操作を記録します。またCloudWatchはS3のデータを直接分析してアラームを発火するのではなく、CloudTrailがCloudWatch Logsに転送したログをフィルタリングしてメトリクスを作成する形で連携します。\n\n【Cが違う理由】SNSはメッセージ配信サービスであり、CloudTrailを操作してS3へのアクセスを禁止する機能はありません。アクセス制御はIAMポリシーやS3バケットポリシーで行います。'
  },
  {
    id: 79,
    level: 'basic',
    diagram: `
[Lambda / EC2]
    ↓ (シークレット取得リクエスト)
[Secrets Manager]
    ↓ (暗号化された認証情報)
[RDS / 外部API]
    ↑ (取得した認証情報で接続)
`,
    question: 'この構成図のユースケースとして最も適切なものはどれか？',
    choices: [
      'A. アプリケーションコードにDBパスワードを直接書かず、Secrets Managerから実行時に取得してRDSに接続するシークレット管理構成',
      'B. Secrets ManagerがRDSのパスワードをアプリケーション起動時に環境変数として自動注入し、Lambda再デプロイなしにローテーションを反映する構成',
      'C. LambdaがSecrets ManagerへのアクセスにIAMロール不要でシークレットを取得でき、VPC外からでも安全に認証情報を受け取れる構成',
      'D. Secrets ManagerがRDSのパスワードをアプリケーション側でローテーションし、Lambda側のコードを更新することなくDBへの接続を維持する構成'
    ],
    answer: 'A',
    explanation: '【正解: A】DBパスワードや外部APIキーなどの機密情報をSecrets Managerに格納し、アプリケーションが実行時にAPI呼び出しで取得する構成です。コードや設定ファイルへのハードコードを防ぎ、自動ローテーション機能でパスワードの定期更新も可能です。\n\n【Bが違う理由】Secrets Managerは環境変数を自動注入する機能を持ちません。アプリケーションがSecrets Manager APIを呼び出して値を取得するのが正しい使い方です。また環境変数への注入ではローテーション後の値が自動反映されません。\n\n【Cが違う理由】Secrets ManagerへのアクセスにはIAMポリシーによる権限付与が必要です。IAMロール不要でシークレットを取得できる構成は存在しません。\n\n【Dが違う理由】Secrets Managerのローテーションはアプリケーション側ではなくAWS側（Lambdaローテーション関数）が行います。アプリケーションコードの更新は不要ですが、それはSecrets ManagerがDB側のパスワードも連携して更新するためです。'
  },
  {
    id: 80,
    level: 'basic',
    diagram: `
[CloudWatch (CPU使用率 > 70%)]
    ↓ (スケールアウトポリシー発動)
[Auto Scaling Group]
  ↓           ↓           ↓
[EC2-1]    [EC2-2]    [EC2-3(新規)]
         (ALBに自動登録)
`,
    question: 'この構成図のユースケースとして最も適切なものはどれか？',
    choices: [
      'A. ALBのリクエスト数をCloudWatchが監視し、EC2-1が過負荷になるとAuto Scaling GroupがEC2-1を複製してEC2-2・EC2-3を作成、ロードバランシングなしで並列実行する構成',
      'B. CPU使用率の上昇をトリガーにEC2インスタンスを自動追加してALBに登録するオートスケーリング構成',
      'C. CloudWatchがAuto Scaling Groupに対してEC2の垂直スケール（インスタンスタイプ変更）を自動実行し、CPUパワーを動的に増強する構成',
      'D. Auto Scaling GroupがEC2をスポットインスタンスとオンデマンドを混在させてコストを最適化し、CloudWatchがスポット中断を検知してオンデマンドに自動切り替えする構成'
    ],
    answer: 'B',
    explanation: '【正解: B】CloudWatchのメトリクスアラーム（CPU使用率など）をトリガーにAuto Scaling Groupがスケールアウトポリシーを実行してEC2インスタンスを追加し、ALBのターゲットグループに自動登録してトラフィックを分散する構成です。\n\n【Aが違う理由】Auto Scaling Groupが追加するEC2は既存インスタンスの「複製」ではなく、AMIから新たに起動するインスタンスです。またALBによるロードバランシングはAuto Scalingと組み合わせて使うのが標準的な構成です。\n\n【Cが違う理由】CloudWatchとAuto ScalingによるオートスケーリングはEC2インスタンスの台数を増減させる水平スケール（スケールアウト/イン）です。インスタンスタイプを変更する垂直スケール（スケールアップ/ダウン）はオートスケーリングでは行いません。\n\n【Dが違う理由】スポットインスタンスとオンデマンドを混在させたMixed Instance Policyはあり得る構成ですが、CloudWatchがスポット中断を直接検知してオンデマンドへ切り替える機能はありません。スポット中断はEC2インスタンスが受け取る中断通知で処理します。'
  },
  {
    id: 81,
    level: 'basic',
    diagram: `
[Developer]
    ↓ (git push)
[CodeCommit / GitHub]
    ↓ (自動トリガー)
[CodePipeline]
    ↓
[CodeBuild (ビルド・テスト)]
    ↓
[CodeDeploy → EC2 / ECS]
`,
    question: 'この構成図のユースケースとして最も適切なものはどれか？',
    choices: [
      'A. CodeCommitがコードの静的解析を実行し、CodePipelineが解析結果をCodeBuildに送り、CodeDeployが本番環境のEC2に手動承認なしで即時デプロイする構成',
      'B. CodeBuildがEC2にSSHで接続してコードを直接転送し、CodeDeployが転送されたコードの起動確認とロールバック制御を担う構成',
      'C. ソースコードのpushを起点に自動ビルド・テスト・デプロイを行うCI/CDパイプライン構成',
      'D. CodePipelineがEC2のAMIを定期的に再作成してCodeDeployが新AMIからインスタンスを再起動することで、常に最新のコードをクリーンな環境で実行する構成'
    ],
    answer: 'C',
    explanation: '【正解: C】Developer → CodeCommit/GitHubへのpush → CodePipelineが自動起動 → CodeBuildでビルド・単体テスト → CodeDeployで本番デプロイというフローはCI/CD（継続的インテグレーション・継続的デリバリー）パイプラインの典型的な構成です。\n\n【Aが違う理由】CodeCommit自体はコードの静的解析機能を持ちません。静的解析はCodeBuildのビルドフェーズで行います。また本番デプロイに手動承認ゲートを設けるかどうかはパイプライン設定次第であり、この図だけでは判断できません。\n\n【Bが違う理由】CodeDeployはSSHではなくエージェントベースで動作します。EC2上のCodeDeployエージェントがS3やGitHubからデプロイパッケージを取得して展開するため、SSH接続は不要です。\n\n【Dが違う理由】AMIの定期再作成はEC2 Image BuilderやPacker等のツールで行います。CodeDeployはAMIを作成する機能を持たず、既存のEC2インスタンスへのアプリケーションのデプロイが役割です。'
  },
  {
    id: 82,
    level: 'basic',
    diagram: `
[Application]
    ↓ (読み取りリクエスト)
[DAX (DynamoDB Accelerator)]
    ↓ (キャッシュミス時のみ)
[DynamoDB]
`,
    question: 'この構成図のユースケースとして最も適切なものはどれか？',
    choices: [
      'A. DynamoDBへの書き込みリクエストをDAXが受け取り、バッファリングしてまとめてDynamoDBに書き込む書き込み最適化構成',
      'B. DAXがDynamoDBのテーブルスキャン結果をキャッシュし、フルスキャンのコストをゼロにする大規模テーブル最適化構成',
      'C. アプリケーションからDynamoDBへの書き込みをDAXが横取りしてS3にも並列保存するデータ二重化構成',
      'D. インメモリキャッシュ（DAX）でDynamoDBの読み取りレイテンシーをミリ秒からマイクロ秒に短縮する高速化構成'
    ],
    answer: 'D',
    explanation: '【正解: D】DAX（DynamoDB Accelerator）はDynamoDBと互換性のあるインメモリキャッシュです。アプリケーションからの読み取りリクエストをDAXがキャッシュで応答し、キャッシュミス時のみDynamoDBにアクセスすることで、読み取りレイテンシーをシングルデジットミリ秒からマイクロ秒レベルに短縮します。\n\n【Aが違う理由】DAXは読み取りキャッシュが主な機能であり、書き込みのバッファリングは行いません。書き込みリクエストはDAXを経由してDynamoDBに即時書き込まれます（Write-Through方式）。\n\n【Bが違う理由】DAXはアイテム単位のキャッシュ（GetItem・BatchGetItem）に加えてクエリ・スキャン結果のキャッシュも行いますが、「フルスキャンのコストをゼロにする」は誇張です。DAXのキャッシュは有限であり、大規模スキャンのコスト削減が主目的ではありません。\n\n【Cが違う理由】DAXはS3への並列保存機能を持ちません。DAXはDynamoDB専用のキャッシュサービスであり、S3は別系統のストレージです。'
  },
  {
    id: 83,
    level: 'basic',
    diagram: `
[Systems Manager Parameter Store]
    ↓ (GetParameter)
[Lambda / EC2]
    ↓ (設定値を使用)
[外部サービス / RDS 等]
`,
    question: 'この構成図のユースケースとして最も適切なものはどれか？',
    choices: [
      'A. Parameter StoreがLambdaの環境変数を定期的にポーリングして書き換え、コードを再デプロイせずに設定を動的に変更する構成',
      'B. LambdaがParameter Storeのパラメータを変更するたびにEventBridgeがトリガーされ、変更内容をDynamoDBに自動記録する構成',
      'C. 設定値・接続文字列をParameter Storeで一元管理し、アプリケーション起動時に取得して使用するセキュアな設定管理構成',
      'D. Parameter StoreがRDSのパスワードを毎日自動ローテーションし、LambdaがRDS再起動なしに新しいパスワードで接続を維持する構成'
    ],
    answer: 'C',
    explanation: '【正解: C】Systems Manager Parameter StoreはDB接続文字列・APIエンドポイント・フィーチャーフラグなどの設定値を暗号化して一元管理できるサービスです。アプリケーションが起動時または実行時にGetParameterで取得することで、設定をコードやIAMポリシーから分離できます。\n\n【Aが違う理由】Parameter StoreはLambdaの環境変数を直接書き換える機能を持ちません。環境変数の変更にはLambdaの設定更新（UpdateFunctionConfiguration）が必要です。アプリケーションがParameter Storeを参照するのが正しい使い方です。\n\n【Bが違う理由】Parameter Storeのパラメータ変更はEventBridgeのイベントとして発行されますが、「自動的にDynamoDBに記録する」機能は標準では提供されていません。変更履歴はCloudTrailで確認できます。\n\n【Dが違う理由】パスワードの自動ローテーション機能はAWS Secrets Managerが提供しています。Parameter StoreのSecureStringパラメータはKMSで暗号化できますが、RDSとの自動ローテーション連携はSecrets Managerが担います。'
  },
  {
    id: 84,
    level: 'basic',
    diagram: `
[EC2 (CPUメトリクス送信)]
    ↓
[CloudWatch Metrics]
    ↓ (閾値超過)
[CloudWatch Alarm]
    ↓
[SNS Topic → メール / Slack 通知]
`,
    question: 'この構成図のユースケースとして最も適切なものはどれか？',
    choices: [
      'A. CloudWatchがEC2に直接SSHしてCPU使用率を定期取得し、SNS Topicが管理者にメール通知しつつEC2の再起動コマンドを自動実行する構成',
      'B. SNS Topicがメール送信と同時にCloudWatch AlarmのしきいThresholdを動的に引き上げ、繰り返しアラートを自動抑制する構成',
      'C. CloudWatch AlarmがEC2の異常を検知するとSNS Topicに通知し、SNSがCloudWatchダッシュボードを自動更新する構成',
      'D. EC2のCPU使用率が閾値を超えたらCloudWatch AlarmがSNS経由でメール・Slack通知を送るモニタリング構成'
    ],
    answer: 'D',
    explanation: '【正解: D】EC2がCloudWatch Metricsにメトリクスを送信し、CloudWatch Alarmが設定した閾値を超えた際にSNS Topicにアラームを発行、SNSがサブスクライバー（メール・Slack等）に通知を配信するのは最も基本的なAWSモニタリング構成です。\n\n【Aが違う理由】CloudWatchはEC2にSSHしてメトリクスを取得しません。EC2はCloudWatchエージェントまたはデフォルトの基本監視でメトリクスをCloudWatchにプッシュします。またSNSにはEC2再起動コマンドを実行する機能はありません。\n\n【Bが違う理由】SNSはメッセージを配信するだけであり、CloudWatch AlarmのThreshold（しきい値）を動的に変更する機能はありません。Thresholdの変更はCloudWatch APIを呼び出す必要があります。\n\n【Cが違う理由】SNSはCloudWatchダッシュボードを自動更新する機能を持ちません。ダッシュボードはCloudWatch APIで管理するものであり、SNSのサブスクリプション先にはなりません。'
  },
  {
    id: 85,
    level: 'basic',
    diagram: `
[EC2 (プライベートサブネット)]
    ↓ (インターネット不使用)
[VPC Endpoint (Gateway型)]
    ↓
[S3]
`,
    question: 'この構成図のユースケースとして最も適切なものはどれか？',
    choices: [
      'A. VPC EndpointがS3をVPC内に仮想的に配置することで、S3への通信をNAT Gatewayより高速化してレイテンシーを削減する構成',
      'B. VPC Endpoint (Gateway)経由でEC2からS3へアクセスするとS3のデータが自動的にVPC内のキャッシュに格納され、次回アクセスを高速化する構成',
      'C. EC2がVPC Endpointを通じてS3に接続する際にVPCフローログがS3への全アクセスを記録し、自動的にコンプライアンスレポートを生成する構成',
      'D. プライベートサブネットのEC2からS3へインターネットを経由せずVPC内で通信を完結させ、セキュリティとコストを改善する構成'
    ],
    answer: 'D',
    explanation: '【正解: D】VPC Endpoint（Gateway型）をS3向けに設定すると、プライベートサブネットのEC2はNAT GatewayやInternet Gatewayを使わずにS3へアクセスできます。トラフィックがインターネットに出ないためセキュリティが向上し、NAT Gatewayのデータ処理料金も節約できます。\n\n【Aが違う理由】VPC EndpointはS3をVPC内に物理的・仮想的に配置するわけではありません。S3はAWSマネージドサービスとして独立して存在し、VPC Endpointはルーティングのショートカットを提供するものです。\n\n【Bが違う理由】VPC EndpointにはキャッシュやCDN機能はありません。S3データのキャッシュにはCloudFrontを使います。VPC Endpointはルーティングパスを変更するだけです。\n\n【Cが違う理由】VPCフローログはVPC内のネットワークトラフィックを記録しますが、コンプライアンスレポートを自動生成する機能はありません。S3へのAPIアクセスの詳細な記録にはCloudTrailを使います。'
  },
  {
    id: 86,
    level: 'basic',
    diagram: `
[Lambda A]  [Lambda B]  [Lambda C]
     ↓            ↓            ↓
    [Lambda Layer (共通ライブラリ / 依存パッケージ)]
`,
    question: 'この構成図のユースケースとして最も適切なものはどれか？',
    choices: [
      'A. Lambda LayerがLambda A・B・Cの実行結果をキャッシュし、同じ入力に対して重複処理を省くメモ化（Memoization）構成',
      'B. Lambda A・B・CがLayerを介して互いのメモリ空間を共有し、関数間でデータをリアルタイムに受け渡しする構成',
      'C. Lambda LayerがA・B・Cの実行を仲介するオーケストレーターとして機能し、エラー時に他の関数にフォールバックする耐障害性構成',
      'D. 複数のLambda関数で共通のライブラリ・依存パッケージをLayerとして一元管理し、再利用とデプロイパッケージ容量削減を実現する構成'
    ],
    answer: 'D',
    explanation: '【正解: D】Lambda Layerは共通ライブラリ・フレームワーク・カスタムランタイムをパッケージ化して複数のLambda関数で再利用するための機能です。各関数のデプロイパッケージにライブラリを含める必要がなくなり、管理・更新・容量削減が容易になります。\n\n【Aが違う理由】Lambda LayerにはキャッシュやメモI化機能はありません。Lambdaの実行キャッシュが必要な場合は、ElastiCacheやDynamoDBをキャッシュストアとして使います。\n\n【Bが違う理由】Lambda関数はそれぞれ独立したコンテナで実行されるため、メモリ空間の共有はできません。関数間のデータ受け渡しにはSQS・DynamoDB・S3などを経由します。\n\n【Cが違う理由】Lambda Layerはコードを実行する機能を持たず、ライブラリやファイルを提供するだけです。関数間のオーケストレーションやフォールバック制御にはAWS Step Functionsを使います。'
  },
  {
    id: 87,
    level: 'basic',
    diagram: `
[SQS Main Queue]
    ↓ (通常処理)
[Lambda Consumer]
    ↓ (最大試行回数超過・処理失敗)
[SQS Dead Letter Queue (DLQ)]
`,
    question: 'この構成図のユースケースとして最も適切なものはどれか？',
    choices: [
      'A. 処理に失敗したメッセージをDLQに退避して消失を防ぎ、後から原因調査・再処理できる耐障害性構成',
      'B. DLQがメインキューの処理状況を監視し、Lambda Consumerの処理が遅延した場合に自動でスケールアウトを指示する構成',
      'C. Lambda ConsumerがDLQを常時ポーリングしてメインキューと並行処理することで、全体のスループットを向上させる構成',
      'D. SQS Main QueueがDLQに届いたメッセージを定期的に再取り込みし、Lambdaが自動リトライ処理する自己修復型メッセージング構成'
    ],
    answer: 'A',
    explanation: '【正解: A】Lambda ConsumerがSQS Main Queueのメッセージ処理に繰り返し失敗し最大受信数（MaxReceiveCount）を超えると、そのメッセージは自動的にDLQへ移動されます。メッセージが消失せず後から調査・再処理できる耐障害性パターンです。\n\n【Bが違う理由】DLQはメッセージを受け取るキューであり、Lambda Consumerのスケールアウトを制御する機能はありません。スケーリングはEventSourceMappingの設定やLambdaのConcurrency設定が担います。\n\n【Cが違う理由】図の構成ではLambda ConsumerはMain Queueをポーリングしており、DLQを並行してポーリングする構成にはなっていません。DLQのメッセージは別途手動または専用のLambdaで再処理します。\n\n【Dが違う理由】SQS Main QueueはDLQのメッセージを自動的に再取り込みする機能はありません。DLQのメッセージを再処理するにはAWS ConsoleのDLQ Redrive機能、またはLambdaからメッセージを読み取ってMain Queueに再送する処理を実装する必要があります。'
  },
  {
    id: 88,
    level: 'basic',
    diagram: `
[S3 Bucket (ソースリージョン: ap-northeast-1)]
    ↓ (Cross-Region Replication: CRR)
[S3 Bucket (レプリカリージョン: us-east-1)]
`,
    question: 'この構成図のユースケースとして最も適切なものはどれか？',
    choices: [
      'A. CRRが有効な2つのS3バケットで双方向同期を行い、どちらのリージョンにアップロードしても自動的にもう一方に反映されるアクティブ-アクティブ構成',
      'B. S3 CRRによって別リージョンにデータを自動複製し、リージョン障害時のDR（災害対策）と低レイテンシーアクセスを実現する構成',
      'C. CRRがS3オブジェクトを複製する際にKMSキーを自動生成し、レプリカリージョンでの暗号化キーをソースと完全に独立させる構成',
      'D. S3 CRRが複製したオブジェクトをGlacierに自動移行し、ソースリージョンのS3 Standardよりも低コストで長期保存する構成'
    ],
    answer: 'B',
    explanation: '【正解: B】S3 Cross-Region Replication（CRR）はソースバケットのオブジェクトを別リージョンのレプリカバケットに自動複製します。リージョン全体の障害（自然災害等）への対策（DR）や、別リージョンのユーザーへの低レイテンシーアクセスを実現できます。\n\n【Aが違う理由】S3 CRRはデフォルトでは一方向の複製です。双方向同期（Bidirectional Replication）にするには両方のバケットにそれぞれCRRルールを設定する必要があります。また自動的なアクティブ-アクティブはCRR単体では実現しません。\n\n【Cが違う理由】CRRはKMSキーを自動生成しません。暗号化されたオブジェクトを複製する場合、レプリカリージョンで使用するKMSキーをCRRの設定で明示的に指定する必要があります。\n\n【Dが違う理由】CRRは複製後にGlacierに自動移行する機能を持ちません。Glacierへの移行はS3ライフサイクルポリシーで別途設定します。CRRとライフサイクルポリシーは独立した機能です。'
  },
  {
    id: 89,
    level: 'basic',
    diagram: `
[Application]
    ↓ (オブジェクトアップロード)
[S3 Bucket (SSE-KMS暗号化有効)]
    ↓ (暗号化キー管理)
[KMS (Customer Managed Key: CMK)]
`,
    question: 'この構成図のユースケースとして最も適切なものはどれか？',
    choices: [
      'A. KMSがS3に保存されたオブジェクトを定期的にスキャンして暗号化状態を検証し、未暗号化オブジェクトを自動的に再暗号化する構成',
      'B. ApplicationがKMSで事前に暗号化したオブジェクトをS3にアップロードするクライアントサイド暗号化構成で、S3はデータの内容を一切知らない',
      'C. カスタマー管理キー（CMK）でS3オブジェクトをサーバーサイド暗号化し、キーポリシーで暗号化・復号できるIAMエンティティを細かく制御する構成',
      'D. S3がKMSのCMKを使って署名付きURLを発行し、URLを持つユーザーだけが暗号化されたオブジェクトを一時的に復号・ダウンロードできる構成'
    ],
    answer: 'C',
    explanation: '【正解: C】S3のSSE-KMS（Server-Side Encryption with AWS KMS）を使うと、S3へのオブジェクト保存時にKMSのカスタマー管理キー（CMK）でサーバーサイド暗号化が行われます。CMKのキーポリシーとIAMポリシーで、どのユーザー・ロールが暗号化・復号を行えるかを細かく制御できます。\n\n【Aが違う理由】KMSはS3のオブジェクトを定期スキャンする機能を持ちません。SSE-KMSが有効なバケットにアップロードされたオブジェクトはS3が自動的に暗号化します。未暗号化オブジェクトの自動再暗号化はS3の「デフォルト暗号化」設定で対応します。\n\n【Bが違う理由】図の構成はSSE-KMS（サーバーサイド暗号化）を示しており、クライアントサイド暗号化とは異なります。SSE-KMSではS3がKMSを呼び出して暗号化・復号を行うため、S3はデータにアクセスできます（暗号化の責任はKMSキーポリシーで管理します）。\n\n【Dが違う理由】KMSのCMKは署名付きURLの発行に関与しません。S3の署名付きURLはS3サービス自身またはAWS SDKが生成するものです。署名付きURLとSSE-KMSは独立した機能です。'
  },
  {
    id: 90,
    level: 'basic',
    diagram: `
[EBS Volume (EC2にアタッチ)]
    ↓ (定期スナップショット)
[EBS Snapshot (S3に自動保存)]
    ↓ (AMI化 or 別EC2に復元)
[新規EC2 / 障害復旧]
`,
    question: 'この構成図のユースケースとして最も適切なものはどれか？',
    choices: [
      'A. EBSスナップショットがEC2の実行中メモリ状態も含めて保存し、障害時に完全なインスタンス状態（メモリ含む）をポイントインタイムで復元できる構成',
      'B. EBS VolumeをEC2から切り離してS3バケットに直接マウントし、スナップショットをオブジェクトとして管理する構成',
      'C. EBSスナップショットをAMI化することで、同じディスク状態の新規EC2を別リージョン・別AZに素早く展開できるバックアップ＆リカバリ構成',
      'D. EBSスナップショットのデータをGlacierに自動アーカイブし、ストレージコストを削減しながら長期保存するコスト最適化構成'
    ],
    answer: 'C',
    explanation: '【正解: C】EBS Snapshotは増分バックアップとしてS3に自動保存されます。スナップショットからAMI（Amazon Machine Image）を作成することで、同じディスク構成の新規EC2インスタンスを別AZや別リージョンに展開でき、障害復旧・環境複製・スケールアウトに活用できます。\n\n【Aが違う理由】EBSスナップショットはディスクの内容を保存しますが、実行中のメモリ状態は含みません。完全なインスタンス状態（メモリ含む）の保存にはEC2 Hibernation（ハイバーネーション）などの別の機能が必要です。\n\n【Bが違う理由】EBS VolumeをS3に直接マウントしてオブジェクトとして管理することはできません。EBSはブロックストレージ、S3はオブジェクトストレージであり、異なるストレージタイプです。スナップショットはAWS内部でS3の仕組みを使って保存されますが、ユーザーのS3バケットに直接見えるわけではありません。\n\n【Dが違う理由】EBSスナップショット自体はGlacierに直接アーカイブされません。EBSスナップショットのストレージはAWSが管理する独自のストレージで、ユーザーがGlacierへの移行を選択できるのはS3オブジェクトに対してです。スナップショットコストの削減にはAmazon Data Lifecycle Manager（DLM）による古いスナップショットの自動削除を利用します。'
  }
];
