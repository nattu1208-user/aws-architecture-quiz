/**
 * AWS構成図クイズ - 問題データ
 * 作成者: Sekimoto Naoto
 * 作成日: 2026-04-24
 * 更新日: 2026-04-26
 * 説明: AWS構成図を見てユースケースを当てる逆引き形式クイズの問題データ（全30問）
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
      'A. モノリシックなWebアプリケーションの基本構成',
      'B. EC2をバッチサーバーとして使い、RDSに蓄積されたデータを定期的に集計・加工する分析基盤',
      'C. EC2上のアプリケーションがRDSのリードレプリカのみに接続し、書き込みはDMS経由でオンプレミスDBに送る構成',
      'D. RDSをセッションストアとして使い、EC2がステートレスなAPIサーバーとして水平スケールする構成'
    ],
    answer: 'A',
    explanation: '【正解: A】Client → EC2（Web/Appサーバー） → RDS という構成は、Webサーバーとアプリケーションロジックを1台のEC2にまとめ、RDSをデータ永続化に使うモノリシックWebアプリの典型例です。\n\n【Bが違う理由】EC2 + RDSでバッチ処理を行うこと自体は可能ですが、図にはClientからEC2への矢印があり、クライアントがリクエストを送るWeb/Appサーバーの役割を示しています。バッチサーバーとしての用途と図の構造が一致しません。\n\n【Cが違う理由】RDSのリードレプリカやDMSはこの図に登場しません。オンプレミスとの連携を示す要素が構成図に存在しない以上、この選択肢は図の読み取りとして誤りです。\n\n【Dが違う理由】RDSをセッションストアとして使いEC2がステートレスに動くケースは実在しますが、その場合は通常ELBを介した複数EC2構成になります。図にはEC2が1台のみ描かれており、水平スケールを前提とした構成の説明としては不一致です。'
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
      'A. S3へのファイルアップロードをトリガーとするイベント駆動処理',
      'B. LambdaがS3をポーリングしてファイルの変更を検知し、処理キューに積むプル型のバッチ処理',
      'C. S3のPutObjectイベントをLambdaが受け取り、処理結果を同じS3バケットの同一パスに上書き保存する構成',
      'D. ユーザーがファイルをアップロードするたびにLambdaが同期的にレスポンスを返すリアルタイムファイル変換API'
    ],
    answer: 'A',
    explanation: '【正解: A】ユーザーがS3にファイルをアップロードすると、PutObjectイベントがトリガーとなりLambdaが自動起動するイベント駆動の構成です。画像リサイズ・ファイル変換・メタデータ抽出など幅広い用途で使われます。\n\n【Bが違う理由】S3はLambdaにイベントをプッシュします。LambdaがS3をポーリングする仕組みは存在しません（DynamoDB StreamsやSQSはポーリングですが、S3は異なります）。図の矢印もS3→Lambdaの方向を示しており、プル型の説明とは逆です。\n\n【Cが違う理由】処理結果を同一バケットの同一パスに上書き保存すると、再度PutObjectイベントが発生してLambdaが再トリガーされる無限ループが発生します。実際の設計では出力先を別バケットまたは別プレフィックスに分けることが必須であり、この選択肢は危険なアンチパターンです。\n\n【Dが違う理由】S3のPutObjectイベントはLambdaを非同期で起動します。ユーザーへの同期レスポンスを返す仕組みはこの構成に含まれていません。リアルタイムAPIとして使うには別途API Gatewayなどが必要です。'
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
      'A. API GatewayはCognitoが発行したJWTの署名・有効期限をローカルで検証し、正当なリクエストのみLambdaに転送する',
      'B. CognitoがリクエストごとにLambdaの実行IAMロールを切り替え、ユーザーごとにAWSリソースへのアクセス権限を制御する',
      'C. API Gatewayはリクエストのたびにcognito-idp APIを呼び出してトークンの有効性をリアルタイム検証する',
      'D. LambdaがCognito User Poolに直接問い合わせてユーザー属性を確認し、アクセス可否を自ら判断する'
    ],
    answer: 'A',
    explanation: '【正解: A】API GatewayのCognitoオーソライザーはJWTの署名と有効期限をローカルで検証する。Cognitoへの都度問い合わせは不要で、高速かつスケーラブルに機能する。\n\n【Bが違う理由】IAMロールの動的付与はCognito Identity Pool（フェデレーテッドID）の機能。User Poolはエンドユーザー認証が目的であり、AWSリソースへの権限付与は行わない。\n\n【Cが違う理由】API Gatewayはローカルでの署名検証のためCognitoへのリアルタイム問い合わせは行わない。その結果、トークン失効の即時反映が難しいというトレードオフがある。\n\n【Dが違う理由】アクセス制御の責務はAPI Gatewayオーソライザーにある。LambdaがUser Poolを直接参照してアクセス判断する設計は責務が混在し、セキュリティリスクになる。'
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
      'A. 処理速度の異なるシステム間をキューで繋ぐ非同期処理',
      'B. ProducerがSQSにメッセージを送信すると同時にLambdaが同期的にトリガーされ、処理結果をProducerに即時返却するリクエスト・レスポンス型構成',
      'C. Lambda ConsumerがSQSのメッセージを1件処理するたびにSQSが次のメッセージを自動的にプッシュする、プッシュ型のリアルタイム配信構成',
      'D. SQSのFIFOキューによってProducerの送信順序が厳密に保証され、Lambda Consumerが同一メッセージを重複なく正確に1回だけ処理することが保証される構成'
    ],
    answer: 'A',
    explanation: '【正解: A】Producer → SQS → Lambda Consumerという構成は、送信側と処理側の速度差をキューで吸収する非同期処理の典型です。ProducerはSQSにメッセージを入れるだけで処理完了を待たず、Lambda Consumerが自分のペースで処理します。\n\n【Bが違う理由】SQSはメッセージを一時的に保持するキューであり、ProducerがSQSにメッセージを送信した瞬間にLambdaが同期的にトリガーされる仕組みはありません。LambdaはSQSをポーリングして非同期に起動します。\n\n【Cが違う理由】LambdaとSQSの連携はLambdaがSQSをポーリングする「プル型」です。SQSがLambdaにメッセージをプッシュする仕組みは存在しません。図にも「メッセージポーリング」と明記されています。\n\n【Dが違う理由】SQS FIFOキューは順序保証と重複排除を提供しますが、この図がFIFOキューであるとは明示されていません。また、Lambdaの冪等性はアプリケーション側で担保する必要があり、SQSが自動保証するわけではありません。'
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
      'A. EventBridgeがLambdaの実行ログをS3/DynamoDBに定期的にエクスポートするログアーカイブ構成',
      'B. Cronライクなスケジュール実行による定期バッチ処理',
      'C. EventBridge Schedulerが複数のLambdaを依存関係に従って順次呼び出し、ワークフロー全体の進捗をDynamoDBで管理するオーケストレーション構成',
      'D. Lambdaがタイムアウトした場合にEventBridgeが自動的に再トリガーし、処理結果をS3に冪等に保存するリトライ構成'
    ],
    answer: 'B',
    explanation: '【正解: B】EventBridge Schedulerのcron/rate式でLambdaを定期起動し、処理結果をS3やDynamoDBに保存する構成は、夜間バッチ・定期レポート生成・データ集計などに使われます。\n\n【Aが違う理由】CloudWatch LogsのS3エクスポートはCloudWatch Logs自身のエクスポート機能やKinesis Firehoseで行うものです。EventBridgeがLambdaの実行ログを直接S3にエクスポートする構成は存在しません。\n\n【Cが違う理由】複数Lambdaの依存関係管理やオーケストレーションにはAWS Step Functionsを使うのが適切です。EventBridge Schedulerは単一の宛先を指定してトリガーするものであり、ワークフロー全体の進捗管理機能はありません。\n\n【Dが違う理由】EventBridgeにはLambdaのタイムアウトを検知して自動再トリガーする機能はありません。Lambdaのリトライ制御はLambda側の設定で管理します。EventBridgeはあくまでスケジュールに基づいてトリガーを送るだけです。'
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
      'B. 複数AZへのトラフィック分散と冗長化による高可用性Webシステム',
      'C. ELBがEC2インスタンスごとにスティッキーセッションを有効化し、同一ユーザーのリクエストを常に同一EC2に固定することでRDSへの負荷を軽減する構成',
      'D. Route 53の加重ルーティングでEC2-1に80%、EC2-2に15%、EC2-3に5%のトラフィックを割り当て、新バージョンのカナリアリリースを行う構成'
    ],
    answer: 'B',
    explanation: '【正解: B】Route 53のDNSフェイルオーバー + ELB（ALB）によるトラフィック分散 + 複数AZへのEC2配置という構成は、単一障害点を排除し高可用性を実現するWebシステムの定石です。\n\n【Aが違う理由】Route 53のフェイルオーバールーティングでS3静的ページをセカンダリとして設定すること自体は実在するパターンですが、図にはS3が存在しません。図に描かれていないリソースを前提とした解釈は誤りです。\n\n【Cが違う理由】ELBのスティッキーセッションは実在する機能ですが、RDSへの負荷軽減を目的とするものではありません。この説明は機能の目的を誤って解釈しており、構成の主目的である高可用性・冗長化の説明としては不適切です。\n\n【Dが違う理由】加重ルーティングによるカナリアリリースはRoute 53の機能として存在しますが、それはDNSレベルの振り分けです。ELBが存在するこの構成ではELBがトラフィック分散を担っており、Route 53の役割はDNSフェイルオーバーです。'
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
  }
];
