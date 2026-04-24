/**
 * AWS構成図クイズ - 問題データ
 * 作成者: Sekimoto Naoto
 * 作成日: 2026-04-24
 * 説明: AWS構成図を見てユースケースを当てる逆引き形式クイズの問題データ（全30問）
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
      'B. リアルタイムチャットアプリケーションのバックエンド',
      'C. オンプレミスDBとの定期同期バッチ処理',
      'D. マイクロサービス間の非同期メッセージング'
    ],
    answer: 'A',
    explanation: '【正解: A】Route53でDNS解決 → CloudFrontでエッジキャッシュ配信 → S3から静的ファイル（HTML/CSS/JS）を配信する、最もシンプルな静的サイトホスティングパターン。サーバー不要・低コスト・高可用性が特徴。\n\n【Bが違う理由】リアルタイムチャットにはWebSocket対応のAPI Gateway or AppSyncが必要。\n【Cが違う理由】バッチ同期にはGlue/DMS/Step Functionsが必要。\n【Dが違う理由】非同期メッセージングにはSNS/SQSが必要。'
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
      'A. 大規模なHadoopクラスターによるバッチ分析処理',
      'B. サーバーレスアーキテクチャによるCRUD APIの提供',
      'C. オンプレミスシステムとのハイブリッド接続',
      'D. 機械学習モデルのトレーニングパイプライン'
    ],
    answer: 'B',
    explanation: '【正解: B】API Gateway → Lambda → DynamoDB は、サーバーレスAPIの最定番構成。インフラ管理不要でCreate/Read/Update/Deleteの各操作をLambdaで実装し、DynamoDBに保存する。\n\n【Aが違う理由】HadoopクラスターにはEMRが必要。\n【Cが違う理由】ハイブリッド接続にはDirect Connect/VPN/Transit Gatewayが必要。\n【Dが違う理由】ML学習にはSageMakerが必要。'
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
      'B. グローバルなCDNによるコンテンツ配信',
      'C. IoTデバイスからのリアルタイムデータ収集',
      'D. 機械学習による画像自動分類システム'
    ],
    answer: 'A',
    explanation: '【正解: A】EC2でアプリを動かしRDSでデータを永続化するシンプルかつ古典的な2層Webアプリ構成。多くの既存システムがこのパターンを採用している。\n\n【Bが違う理由】CDNにはCloudFrontが必要。\n【Cが違う理由】IoTデータ収集にはIoT Core/Kinesisが必要。\n【Dが違う理由】画像分類にはRekognition/SageMakerが必要。'
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
      'A. 単一のAPIエンドポイントへの同期リクエスト処理',
      'B. 1つのイベントを複数のサービスに並行配信するファンアウト処理',
      'C. 機械学習モデルのA/Bテスト実行環境',
      'D. マルチリージョンへのデータレプリケーション'
    ],
    answer: 'B',
    explanation: '【正解: B】SNSがメッセージを複数のSQSキューに同時配信し、それぞれのLambdaが独立して処理する「ファンアウト」パターン。注文確定時に在庫更新・メール送信・分析処理を並行実行する場合などに使う。\n\n【Aが違う理由】同期リクエストにはAPI Gatewayが適切。\n【Cが違う理由】A/BテストにはLambdaのエイリアスやCloudFrontのルーティングが使われる。\n【Dが違う理由】データレプリケーションにはDMS/S3クロスリージョンレプリケーションが適切。'
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
      'B. スケジュール実行による定期バッチレポート生成',
      'C. VPC内のプライベートリソースへの安全なアクセス制御',
      'D. グローバルユーザーへの低レイテンシーコンテンツ配信'
    ],
    answer: 'A',
    explanation: '【正解: A】S3にファイルがアップロードされた瞬間にLambdaが自動起動するイベント駆動パターン。画像リサイズ・CSV変換・ウイルススキャンなど「ファイルが来たら処理する」用途に最適。\n\n【Bが違う理由】スケジュール実行にはEventBridge（旧CloudWatch Events）が必要。\n【Cが違う理由】アクセス制御にはIAM/Security Group/NACLが必要。\n【Dが違う理由】CDNにはCloudFrontが必要。'
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
      'A. ユーザーのログイン認証とアクセストークン発行',
      'B. CloudWatchアラートをトリガーとした障害通知・自動対応',
      'C. 静的コンテンツのグローバルキャッシュ配信',
      'D. データウェアハウスへのリアルタイムデータ投入'
    ],
    answer: 'B',
    explanation: '【正解: B】CloudWatchがメトリクス異常を検知してアラームを発火 → SNSが通知 → LambdaがSlack通知や自動復旧を実行するOps自動化パターン。サーバーダウン・CPU高騰などの障害対応に使われる。\n\n【Aが違う理由】認証にはCognito/IAMが必要。\n【Cが違う理由】キャッシュ配信にはCloudFront+S3が必要。\n【Dが違う理由】DWHへのデータ投入にはKinesis Firehose/Glueが必要。'
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
    explanation: '【正解: A】API GatewayのCognitoオーソライザーはJWTの署名と有効期限をローカルで検証する。Cognitoへの都度問い合わせは不要で、高速かつスケーラブルに機能する。\n\n【Bが違う理由】IAMロールの動的付与はCognito Identity Pool（フェデレーテッドID）の機能。User Poolはエンドユーザー認証が目的であり、AWSリソースへの権限付与は行わない。\n【Cが違う理由】API Gatewayはローカルでの署名検証のためCognitoへのリアルタイム問い合わせは行わない。その結果、トークン失効の即時反映が難しいというトレードオフがある。\n【Dが違う理由】アクセス制御の責務はAPI Gatewayオーソライザーにある。LambdaがUser Poolを直接参照してアクセス判断する設計は責務が混在し、セキュリティリスクになる。'
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
      'B. 複数リージョンへの同時データ配信',
      'C. ユーザーの地理情報に基づくルーティング',
      'D. マシンイメージからの自動インスタンス起動'
    ],
    answer: 'A',
    explanation: '【正解: A】SQSキューを間に挟むことでProducerとConsumerを疎結合にし、処理速度の差異をキューが吸収するパターン。注文処理・メール送信・動画エンコードなど時間のかかる処理を非同期化する際に使う。\n\n【Bが違う理由】マルチリージョン配信にはSNS/S3レプリケーションが適切。\n【Cが違う理由】地理ルーティングにはRoute53のGeolocationルーティングポリシーが必要。\n【Dが違う理由】自動起動にはAuto Scaling/EC2 Launch Templateが必要。'
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
      'A. ユーザーリクエストに応答するリアルタイムAPIの提供',
      'B. Cronライクなスケジュール実行による定期バッチ処理',
      'C. 複数サービス間のオーケストレーション管理',
      'D. VPN経由でのオンプレミス接続'
    ],
    answer: 'B',
    explanation: '【正解: B】EventBridgeのスケジューラーが指定時刻にLambdaを起動する定期バッチパターン。日次レポート生成・不要データのクリーンアップ・外部API定期取得などに使われる。\n\n【Aが違う理由】リアルタイムAPIにはAPI Gateway + Lambdaが必要。\n【Cが違う理由】複数ステップのオーケストレーションにはStep Functionsが適切。\n【Dが違う理由】オンプレミス接続にはDirect Connect/Site-to-Site VPNが必要。'
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
      'A. サーバーレスによるコスト最小化構成',
      'B. 複数AZへのトラフィック分散と冗長化による高可用性Webシステム',
      'C. 単一EC2インスタンスへの専用線接続',
      'D. S3バケットのバージョニングと静的ホスティング'
    ],
    answer: 'B',
    explanation: '【正解: B】Route53でDNSフェイルオーバー → ELBが複数AZのEC2にトラフィックを分散させる高可用性構成。1台が落ちても他のEC2が処理を引き継ぎ、サービスが継続できる。\n\n【Aが違う理由】コスト最小化ならEC2ではなくLambda+DynamoDBのサーバーレス構成が適切。\n【Cが違う理由】専用線接続にはDirect Connectが必要。\n【Dが違う理由】S3静的ホスティングはEC2を使わない。'
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
      'B. 機械学習モデルのリアルタイム推論エンドポイント',
      'C. 静的アセットのグローバルエッジ配信',
      'D. IoTデバイスからの大量センサーデータ受信'
    ],
    answer: 'A',
    explanation: '【正解: A】ALBがトラフィックを分散 → ECS Fargateでコンテナを実行（サーバー管理不要）→ AuroraでDB → ElastiCacheでセッション/クエリキャッシュという「コンテナWebアプリの定番本番構成」。\n\n【Bが違う理由】ML推論にはSageMaker Endpointが必要。\n【Cが違う理由】エッジ配信にはCloudFront+S3が必要。\n【Dが違う理由】IoTデータ受信にはIoT Core/Kinesisが必要。'
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
      'B. ユーザーが手動でAIモデルを選択するMLプラットフォーム',
      'C. 複数AZにまたがるRDSレプリカの自動フェイルオーバー',
      'D. 動画ストリーミングのアダプティブビットレート変換'
    ],
    answer: 'A',
    explanation: '【正解: A】S3アップロード → Lambda起動 → Rekognitionで顔認識・物体検出などのAI分析 → 結果をDynamoDBに保存する「自動画像分析パイプライン」。SNS画像モデレーション・ECサイトの自動タグ付けなどに使われる。\n\n【Bが違う理由】ユーザー操作型MLにはSageMaker Studioが適切。\n【Cが違う理由】RDSフェイルオーバーはRDS Multi-AZの機能であり、このサービス組み合わせとは別。\n【Dが違う理由】動画変換にはMediaConvertが必要。'
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
      'B. 複数データベース間のリアルタイムデータ同期',
      'C. ユーザー認証情報のキャッシュとセッション管理',
      'D. ECSタスクの定期的なヘルスチェックと再起動'
    ],
    answer: 'A',
    explanation: '【正解: A】API Gatewayがリクエストを受け取ったらすぐに202を返し、実処理はSQS→Lambdaで非同期実行するパターン。動画エンコード・大量メール送信など時間のかかる処理でタイムアウトを回避できる。\n\n【Bが違う理由】DB間同期にはDMS（Database Migration Service）やGlueが適切。\n【Cが違う理由】セッション管理にはElastiCacheが適切。\n【Dが違う理由】ECSヘルスチェックはECSとALBのヘルスチェック機能で実現する。'
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
      'B. 複数AWSアカウントにまたがるコスト一元管理',
      'C. オンプレミスからクラウドへのデータベース移行',
      'D. 機械学習によるログ異常検知とアラート'
    ],
    answer: 'A',
    explanation: '【正解: A】CloudFrontでエッジキャッシュ＋DDoS軽減 → WAFでSQLインジェクション・XSS・ボットなどの悪意あるリクエストをフィルタリング → ALBで分散 → EC2で処理する「WAF付きセキュアWebアプリ」の定番構成。\n\n【Bが違う理由】コスト管理にはAWS Organizations/Cost Explorerが必要。\n【Cが違う理由】DB移行にはDMS（Database Migration Service）が必要。\n【Dが違う理由】ログ異常検知にはCloudWatch Logs Insights/Security Hubが必要。'
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
      'B. ユーザーのリアルタイムゲームスコアのランキング更新',
      'C. マイクロサービス間のサービスメッシュ通信管理',
      'D. EC2インスタンスのOSパッチ自動適用'
    ],
    answer: 'A',
    explanation: '【正解: A】Kinesisでリアルタイムストリーム受信 → Lambdaで変換・フィルタリング → S3にデータレイク構築 → AthenaでサーバーレスSQLクエリという「ストリーミング分析基盤」の基本パターン。クリックログ・IoTデータの分析に使われる。\n\n【Bが違う理由】ゲームランキングにはElastiCache（Redis Sorted Sets）が適切。\n【Cが違う理由】サービスメッシュにはApp Mesh/ECS Service Connectが必要。\n【Dが違う理由】OSパッチ適用にはSystems Manager Patch Managerが必要。'
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
      'B. 複数リージョンへの同時データ書き込み',
      'C. WAFによるHTTPリクエストのレートリミット制御',
      'D. EKSクラスターへの新バージョンアプリのローリングデプロイ'
    ],
    answer: 'A',
    explanation: '【正解: A】Step Functionsが複数のLambdaをオーケストレーションするワークフローパターン。各ステップの実行・失敗・リトライ・分岐を視覚的に管理でき、注文処理・ETL・承認フローなどの複雑な業務処理に使われる。\n\n【Bが違う理由】マルチリージョン書き込みにはDynamoDB Global TablesやS3レプリケーションが適切。\n【Cが違う理由】レートリミットにはAPI GatewayのUsage PlanやWAFが担当する。\n【Dが違う理由】EKSデプロイにはKubernetesのRollingUpdate戦略が使われる。'
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
      'B. 単一DBへの書き込みを複数リージョンにレプリケーション',
      'C. 障害発生時の自動ロールバック処理',
      'D. API Gatewayのスロットリング制御'
    ],
    answer: 'A',
    explanation: '【正解: A】SNSが1つのイベントを複数のSQSに配信し、在庫更新・メール送信・分析記録が完全に独立して並行処理されるマイクロサービスファンアウトパターン。各サービスが疎結合になるためスケーリング・障害が互いに影響しない。\n\n【Bが違う理由】DBレプリケーションにはDynamoDB Global TablesやRDS Read Replicaが適切。\n【Cが違う理由】自動ロールバックにはCodeDeployやCloudFormationのロールバック機能が必要。\n【Dが違う理由】スロットリングはAPI GatewayのUsage Planで設定する。'
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
      'B. マルチAZにわたるWebアプリの高可用性構成',
      'C. S3バケットの不正アクセス検知とアラート',
      'D. ECSコンテナイメージの脆弱性スキャン'
    ],
    answer: 'A',
    explanation: '【正解: A】Glueでデータ変換・クレンジング → S3にデータレイク → Athenaでサーバーレスクエリ → QuickSightでBI可視化という「AWSデータ分析基盤の定番スタック」。ETLサーバー不要でスケーラブルに大量データを分析できる。\n\n【Bが違う理由】高可用性Webアプリ構成にはALB+EC2+RDS Multi-AZが必要。\n【Cが違う理由】S3不正アクセス検知にはMacie/GuardDutyが必要。\n【Dが違う理由】コンテナ脆弱性スキャンにはECRのイメージスキャン機能やInspectorが必要。'
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
      'B. オンプレミスサーバーからAWSへの大量データ移行',
      'C. 複数AWSサービスのコスト最適化レコメンデーション',
      'D. API Gatewayのカスタムドメイン設定とSSL証明書管理'
    ],
    answer: 'A',
    explanation: '【正解: A】コードPush → CodePipelineが自動起動 → CodeBuildでビルド・テスト → ECRにDockerイメージをPush → ECSに自動デプロイする「コンテナCI/CDパイプライン」の定番構成。\n\n【Bが違う理由】大量データ移行にはSnowball/DMSが必要。\n【Cが違う理由】コスト最適化にはCost Explorerや Compute Optimizerが必要。\n【Dが違う理由】ドメイン設定はAPI GatewayとACM（証明書）の設定で行う。'
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
      'B. 複数のAWSアカウントにまたがるVPCピアリング',
      'C. Lambdaのデプロイパッケージ管理とバージョン管理',
      'D. 外部SaaSサービスへのWebhook送信と応答処理'
    ],
    answer: 'A',
    explanation: '【正解: A】Direct Connectで物理専用線を引き、インターネットを経由せずオンプレミスとVPCを接続するハイブリッドクラウド構成。高帯域・低レイテンシ・安定性が必要な基幹業務システム連携に使われる。\n\n【Bが違う理由】アカウント間VPCピアリングはVPC Peeringで設定する。Direct Connectとは別の機能。\n【Cが違う理由】Lambdaバージョン管理はLambda自体のバージョン・エイリアス機能で行う。\n【Dが違う理由】Webhook送信にはLambda+API Gatewayが使われる。'
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
      'A. HTTP Polling による定期的なデータ更新確認',
      'B. WebSocketを使ったリアルタイム双方向通信チャットシステム',
      'C. 大量ファイルのS3へのマルチパートアップロード管理',
      'D. RDSのリードレプリカへの読み取り負荷分散'
    ],
    answer: 'B',
    explanation: '【正解: B】API Gateway WebSocket APIがクライアント間の持続的接続を管理 → Lambdaがメッセージをルーティング → DynamoDBで接続IDを管理してブロードキャストを実現するリアルタイムチャットパターン。\n\n【Aが違う理由】Pollingはクライアントが定期的にHTTPリクエストするだけで、WebSocket APIが不要。\n【Cが違う理由】マルチパートアップロードはS3の機能で管理され、このアーキテクチャとは無関係。\n【Dが違う理由】RDSレプリカ読み分けはRDS ProxyやアプリレベルのDNSで行う。'
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
      'B. 大量のアウトバウンドメールをバルク送信するキャンペーンシステム',
      'C. メールサーバーのSPAM自動フィルタリング',
      'D. 社内グループウェアとのカレンダー同期処理'
    ],
    answer: 'A',
    explanation: '【正解: A】SESがメールを受信 → S3にメール本文を保存 → Lambdaがその内容を解析して後続処理（Issueの自動作成・フォーム入力・DBへの登録など）を実行するメール受信処理パターン。\n\n【Bが違う理由】バルク送信にはSESの送信APIを使い、受信構成は不要。\n【Cが違う理由】SPAMフィルタリングはSES自体の機能、またはWorkMailが担当する。\n【Dが違う理由】カレンダー同期にはLambda+外部カレンダーAPIの組み合わせが使われ、SESは関係ない。'
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
      'A. スタートアップの素早いMVPリリース向けシンプル構成',
      'B. 検索・キャッシュ・DBを備えた大規模Webシステムのコンテナ運用',
      'C. サーバーレスバッチによる深夜のETL処理',
      'D. 単一リージョン内のVPC間トラフィック暗号化'
    ],
    answer: 'B',
    explanation: '【正解: B】CloudFrontでエッジ配信 → ALBで負荷分散 → EKSで大量のコンテナPodをオーケストレーション → Auroraで高可用性DB・ElastiCacheでキャッシュ・OpenSearchで全文検索という「大規模Webシステムの本格的なコンテナ運用構成」。\n\n【Aが違う理由】MVPならECS FargateやApp Runnerのような管理が簡単なサービスが適切。EKSは運用コストが高い。\n【Cが違う理由】サーバーレスETLにはGlue/Lambda/Step Functionsが適切。\n【Dが違う理由】VPC間暗号化にはPrivateLink/VPCピアリング+TLSが適切。'
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
      'A. Fargateコンテナのオートスケーリングに基づく自動デプロイ',
      'B. ストリームデータを変換・蓄積してBIで分析するデータウェアハウス基盤',
      'C. 複数アカウントにまたがるIAMロールの一元管理',
      'D. CloudFrontのキャッシュ無効化を自動トリガーするデプロイ処理'
    ],
    answer: 'B',
    explanation: '【正解: B】Kinesis Firehoseが準リアルタイムでS3にデータを蓄積 → Lambdaで変換してRedshiftに投入 → QuickSightでBIダッシュボードを構築する「フルマネージドDWH基盤」。大量のビジネスデータ分析に使われる。\n\n【Aが違う理由】コンテナオートスケーリングにはECS Auto ScalingとALBが担当する。\n【Cが違う理由】IAM一元管理にはAWS Organizations/SSO (IAM Identity Center)が必要。\n【Dが違う理由】CloudFrontキャッシュ無効化はCodePipelineのデプロイアクションやLambdaから直接CloudFront APIを呼ぶことで実現する。'
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
      'B. マイクロサービスのサービスディスカバリーと負荷分散',
      'C. RDSのバックアップを別リージョンに自動コピー',
      'D. Kinesisストリームのシャードによるパーティションキーベースのデータ分散'
    ],
    answer: 'A',
    explanation: '【正解: A】Transit Gatewayが「ネットワークハブ」として機能し、Direct Connect・VPN・複数VPCを1か所で相互接続するハブアンドスポーク構成。多アカウント・多拠点環境のネットワーク管理を大幅に簡略化できる。\n\n【Bが違う理由】サービスディスカバリーにはCloud Map/ECS Service Discovery/App Meshが使われる。\n【Cが違う理由】クロスリージョンバックアップはRDS自動バックアップのクロスリージョンコピー機能で実現する。\n【Dが違う理由】KinesisシャードはKinesis内部の概念で、このネットワーク図とは無関係。'
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
      'B. 単純なCRUD操作のみを提供するREST API',
      'C. ALBのターゲットグループを使ったA/Bテスト',
      'D. ElastiCacheのクラスターノード追加による読み取りスケールアウト'
    ],
    answer: 'A',
    explanation: '【正解: A】Step FunctionsがLambdaのオーケストレーションと例外処理を担当 → 失敗時はSNSで通知+DLQにメッセージを退避することで、処理失敗したメッセージを後から再処理できる高信頼ワークフロー。金融・医療など失敗が許されないシステムに適している。\n\n【Bが違う理由】シンプルなCRUD APIにStep FunctionsやDLQは過剰。API Gateway+Lambdaで十分。\n【Cが違う理由】A/BテストにはALBの重み付けルーティングやCloudFrontのオリジングループが使われる。\n【Dが違う理由】ElastiCacheのスケールアウトはCluster Modeの設定変更で行う。'
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
      'B. EBSボリュームの暗号化キーを定期ローテーションする処理',
      'C. RDSの負荷をProxyで軽減しコネクションプールを管理する構成',
      'D. CloudTrailのログをS3に集約してコスト分析する基盤'
    ],
    answer: 'A',
    explanation: '【正解: A】MacieがS3内のクレジットカード番号・個人情報などを機械学習で自動検出 → Security Hubに集約 → EventBridgeでルール評価 → Lambdaで自動隔離・SNSで担当者通知という「セキュリティ自動対応（SOAR）」パターン。\n\n【Bが違う理由】KMSキーのローテーションはKMSの自動ローテーション設定で行う。\n【Cが違う理由】コネクションプール管理にはRDS Proxyが必要。\n【Dが違う理由】CloudTrailログ分析にはAthena/CloudWatch Logs Insightsが適切。'
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
      'A. シングルAZのRDSインスタンスに対する定期スナップショット取得',
      'B. 複数リージョンにまたがるAuroraのグローバルフェイルオーバーによる高可用性システム',
      'C. EKSのPodに対するカスタムオートスケーリングポリシーの設定',
      'D. API GatewayのエンドポイントタイプをRegionalからEdgeへ変更する処理'
    ],
    answer: 'B',
    explanation: '【正解: B】Aurora Global Databaseが複数リージョンにレプリカを持ち、プライマリリージョン障害時にRoute53のフェイルオーバーが自動DNS切り替え → CloudFrontが切り替え後のリージョンにルーティングするグローバル高可用性パターン。RPO=0秒・RTO=数分を実現できる。\n\n【Aが違う理由】単一AZのスナップショット取得はRDSの自動バックアップ機能で設定できる。このマルチリージョン構成とは無関係。\n【Cが違う理由】EKSオートスケーリングにはHPA/VPA/Cluster Autoscalerが使われる。\n【Dが違う理由】API Gatewayエンドポイントタイプの変更はマネジメントコンソール/CLI/CDKで直接変更できる。'
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
      'B. CloudFrontのディストリビューションを別リージョンに複製するDR設計',
      'C. EBSスナップショットのクロスアカウントコピーと復元テスト',
      'D. Lambdaのコールドスタートを防ぐためのプロビジョニング済み同時実行の設定'
    ],
    answer: 'A',
    explanation: '【正解: A】Blue/Greenデプロイでは旧バージョン(Blue)を稼働させつつ新バージョン(Green)を別ターゲットグループに展開 → テスト後に100%トラフィックをGreenに切り替え → 問題あればBlueに即ロールバックできる「ゼロダウンタイムデプロイ」パターン。RDS Multi-AZがDB高可用性を担保する。\n\n【Bが違う理由】CloudFrontのDR設計はRoute53フェイルオーバー+オリジン冗長化で実現する。\n【Cが違う理由】EBSスナップショットのクロスアカウントコピーはData Lifecycle Manager/スナップショットの共有設定で行う。\n【Dが違う理由】Lambda Provisioned Concurrencyはマネジメントコンソールや設定ファイルで指定できる。'
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
      'B. スマートフォンアプリのプッシュ通知をグローバルに一斉配信するシステム',
      'C. SaaSアプリのマルチテナント分離とIAMポリシーの動的制御',
      'D. 複数AWSアカウント間のコスト按分レポートを自動生成する仕組み'
    ],
    answer: 'A',
    explanation: '【正解: A】IoT CoreがMQTTデバイスを管理 → Kinesisでリアルタイム受信 → Lambdaで変換・異常検知 → DynamoDBで最新状態管理 → S3に長期蓄積 → Timestreamで時系列データ管理 → Grafanaで可視化という「フルスタックIoTデータ基盤」。スマートファクトリー・ビル管理・農業IoTなどに使われる。\n\n【Bが違う理由】プッシュ通知にはSNS (モバイルプッシュ) やPinpointが必要。IoT Coreは不要。\n【Cが違う理由】マルチテナント分離にはCognito/IAMロール/リソースベースポリシーが使われ、IoT Coreとは無関係。\n【Dが違う理由】コスト按分レポートにはCost ExplorerやAWS Cost and Usage Reportが必要。'
  }
];
