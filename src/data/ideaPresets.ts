import { AppIdea } from '../types';
import { FOCUS_FORGE_WIREFRAME, BAZAAR_DIRECT_WIREFRAME, BILL_PULSE_WIREFRAME } from './wireframePresets';

export const INITIAL_PRESET_IDEAS: AppIdea[] = [
  {
    id: 'frugal-study-pal',
    title: 'FocusForge: Audio & Mindmap Study Engine',
    tagline: 'Turn lecture recordings & messy PDF notes into bite-sized audio summaries and spaced-repetition flashcards.',
    category: 'EdTech / Productivity',
    targetAudience: 'University students, self-taught developers, and exam candidates on tight budgets',
    problemStatement: 'Students waste 15+ hours/week re-listening to hours of droning lectures or pay $30/month for bloated commercial study apps that lock flashcards behind subscriptions.',
    coreFeatures: [
      'Zero-Latency Voice Note Transcription using on-device SpeechRecognizer (no cloud bill)',
      'Smart Flashcard Synthesizer with Anki-compatible SuperMemo SM-2 algorithm',
      'Interactive Concept Mindmap rendered in lightweight vector Canvas',
      'Pomodoro Flow Session with ambient binaural beats',
      'Peer P2P Flashcard Syncing over Wi-Fi Direct (no backend server needed)'
    ],
    monetization: 'Freemium: Core offline study free forever; optional $2.99 one-time lifetime unlock for high-res PDF exports and custom audio presets.',
    competitiveEdge: '100% offline-first. Uses client device computing instead of charging high recurring cloud costs like Quizlet or Notion AI.',
    userFlowSteps: [
      '1. Student records 5-minute audio lecture summary or pastes textbook excerpt.',
      '2. App extracts key terminology and auto-generates 10 spaced-repetition flashcards.',
      '3. Review cards via daily review queue using Leitner 5-box intervals.',
      '4. Progress saves to local SQLite (Room) with zero server lag.'
    ],
    costOptimization: {
      frugalMonthlyCostEstimate: '$0.00 / month',
      enterpriseMonthlyCostEstimate: '$420.00 / month',
      savingsPercentage: '100% Savings',
      totalWorkloadHoursSaved: '120 dev hours',
      frugalStackRecommendation: [
        {
          layer: 'Database & Storage',
          highCostSolution: 'AWS Aurora Serverless + S3 ($110/mo)',
          highCostEstimate: '$110/mo',
          frugalSolution: 'Android Room (SQLite) + Cloudflare R2 backup ($0/mo)',
          frugalCostEstimate: '$0/mo',
          howItDoesSameWork: 'Student notes and flashcards stay on-device. Zero query latency, works on airplanes, 100% private.',
          savingsRatio: 'Infinite'
        },
        {
          layer: 'Authentication',
          highCostSolution: 'Auth0 B2C ($120/mo after free tier)',
          highCostEstimate: '$120/mo',
          frugalSolution: 'Google Identity Services (One Tap) + Supabase Auth Free ($0/mo)',
          frugalCostEstimate: '$0/mo',
          howItDoesSameWork: 'Same seamless OAuth2 sign-in flow with zero credential liability.',
          savingsRatio: '100%'
        },
        {
          layer: 'AI Summaries & Extraction',
          highCostSolution: 'OpenAI GPT-4o API ($150/mo)',
          highCostEstimate: '$150/mo',
          frugalSolution: 'Gemini 3.5 Flash with cached system prompt ($2-$4/mo or Free)',
          frugalCostEstimate: '$2/mo',
          howItDoesSameWork: 'Gemini Flash provides 1M token context, sub-500ms speed, and costs 90% less per token.',
          savingsRatio: '98%'
        },
        {
          layer: 'Audio Hosting / CDN',
          highCostSolution: 'AWS CloudFront + Transcribe API ($90/mo)',
          highCostEstimate: '$90/mo',
          frugalSolution: 'Android On-Device SpeechRecognizer + Local OGG compression ($0/mo)',
          frugalCostEstimate: '$0/mo',
          howItDoesSameWork: 'Encodes audio locally in Ogg Opus at 24kbps; transcribes via Google Play Services on-device API.',
          savingsRatio: '100%'
        }
      ],
      actionableHacks: [
        'Run SM-2 Spaced Repetition entirely on device in Kotlin; zero backend queries required for review loops.',
        'Compress voice notes to 24kbps Opus before syncing to keep storage under 50MB per user/year.',
        'Use Room @Transaction with Flow for instant UI updates that never block the main thread.'
      ]
    },
    architecturalBlueprint: {
      pattern: 'Clean Architecture + Offline-First MVVM + Repository Pattern',
      frontendLayers: [
        'Presentation: Jetpack Compose with Material 3 Dark/Light themes',
        'ViewModel: Kotlin StateFlow with sealed UiState (Idle, Loading, Success, Error)',
        'Domain: UseCases (GetDueCardsUseCase, GenerateCardsFromTextUseCase)'
      ],
      backendLayers: [
        'Local Data Source: Room Database (DeckDao, CardDao, StudySessionDao)',
        'Remote Sync: Supabase PostgREST or Firebase Firestore (optional cloud backup)',
        'AI Gateway: Gemini 3.5 Flash REST client via Retrofit'
      ],
      dataSchemas: [
        {
          tableName: 'decks',
          description: 'Top-level study collections or subjects',
          fields: [
            { name: 'id', type: 'TEXT', isPrimary: true, notes: 'UUID v4' },
            { name: 'title', type: 'TEXT', notes: 'Subject name' },
            { name: 'color_hex', type: 'TEXT', notes: 'M3 accent color' },
            { name: 'card_count', type: 'INTEGER', notes: 'Denormalized count' },
            { name: 'updated_at', type: 'INTEGER', notes: 'Epoch timestamp for delta sync' }
          ]
        },
        {
          tableName: 'flashcards',
          description: 'Spaced repetition cards with question & answer',
          fields: [
            { name: 'id', type: 'TEXT', isPrimary: true },
            { name: 'deck_id', type: 'TEXT', notes: 'Foreign key -> decks.id' },
            { name: 'front_text', type: 'TEXT', notes: 'Question / Prompt' },
            { name: 'back_text', type: 'TEXT', notes: 'Answer / Explanation' },
            { name: 'interval_days', type: 'INTEGER', notes: 'SM-2 interval' },
            { name: 'ease_factor', type: 'REAL', notes: 'SM-2 difficulty multiplier' },
            { name: 'due_date', type: 'INTEGER', notes: 'Unix timestamp for review queue' }
          ]
        }
      ],
      apiEndpoints: [
        {
          method: 'POST',
          endpoint: '/v1beta/models/gemini-3.5-flash:generateContent',
          description: 'Extract flashcards from unstructured notes',
          freeTierImpact: 'Zero cost on free tier (< 15 RPM)'
        },
        {
          method: 'POST',
          endpoint: '/rest/v1/user_sync',
          description: 'Push delta updates to Supabase Postgres (only modified records)',
          freeTierImpact: 'Included in Supabase 500MB free database'
        }
      ],
      securityConsiderations: [
        'Zero credentials stored on device; tokens in Android EncryptedSharedPreferences',
        'Row Level Security (RLS) on Postgres: users can only read/write their own auth.uid() rows',
        'App Check enabled on mobile requests to prevent unauthorized API scraping'
      ],
      offlineSyncStrategy: 'Single Source of Truth: UI always observes Room database. Network pushes changes in background using WorkManager.'
    },
    codeSnippets: [
      {
        id: 'compose-ui-study',
        title: 'StudyFlashcardDeckScreen.kt',
        language: 'kotlin',
        category: 'Compose UI',
        description: 'Smooth flip-card animation with gesture controls and Material 3 elevation.',
        code: `@Composable
fun FlashcardStudyScreen(
    deckTitle: String,
    currentCard: FlashcardUiModel,
    onScoreAnswer: (qualityScore: Int) -> Unit,
    modifier: Modifier = Modifier
) {
    var isFlipped by remember { mutableStateOf(false) }
    val rotation by animateFloatAsState(
        targetValue = if (isFlipped) 180f else 0f,
        animationSpec = spring(stiffness = Spring.StiffnessMediumLow),
        label = "card_flip"
    )

    Column(
        modifier = modifier
            .fillMaxSize()
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            text = deckTitle,
            style = MaterialTheme.typography.titleMedium,
            color = MaterialTheme.colorScheme.primary
        )

        Spacer(modifier = Modifier.height(24.dp))

        // Flip Card Box
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .weight(1f)
                .graphicsLayer {
                    rotationY = rotation
                    cameraDistance = 12f * density
                }
                .clickable { isFlipped = !isFlipped }
                .testTag("flashcard_item"),
            shape = RoundedCornerShape(24.dp),
            colors = CardDefaults.cardColors(
                containerColor = MaterialTheme.colorScheme.surfaceVariant
            ),
            elevation = CardDefaults.cardElevation(defaultElevation = 6.dp)
        ) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(24.dp),
                contentAlignment = Alignment.Center
            ) {
                if (rotation <= 90f) {
                    Text(
                        text = currentCard.frontText,
                        style = MaterialTheme.typography.headlineSmall,
                        textAlign = TextAlign.Center
                    )
                } else {
                    Text(
                        text = currentCard.backText,
                        style = MaterialTheme.typography.bodyLarge,
                        textAlign = TextAlign.Center,
                        modifier = Modifier.graphicsLayer { rotationY = 180f }
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        // Quality rating buttons (SM-2: 1 to 5)
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceEvenly
        ) {
            FilledTonalButton(
                onClick = { onScoreAnswer(1); isFlipped = false },
                colors = ButtonDefaults.filledTonalButtonColors(
                    containerColor = MaterialTheme.colorScheme.errorContainer
                )
            ) {
                Text("Hard")
            }
            FilledTonalButton(
                onClick = { onScoreAnswer(3); isFlipped = false }
            ) {
                Text("Good")
            }
            Button(
                onClick = { onScoreAnswer(5); isFlipped = false }
            ) {
                Text("Easy")
            }
        }
    }
}`
      },
      {
        id: 'room-entity-study',
        title: 'FlashcardEntity.kt & Dao',
        language: 'kotlin',
        category: 'Room Database',
        description: 'Room Entity with indices and Flow DAO for reactive, zero-latency local queries.',
        code: `@Entity(
    tableName = "flashcards",
    indices = [Index(value = ["deck_id"]), Index(value = ["due_date"])]
)
data class FlashcardEntity(
    @PrimaryKey
    val id: String = UUID.randomUUID().toString(),
    @ColumnInfo(name = "deck_id")
    val deckId: String,
    @ColumnInfo(name = "front_text")
    val frontText: String,
    @ColumnInfo(name = "back_text")
    val backText: String,
    @ColumnInfo(name = "interval_days")
    val intervalDays: Int = 1,
    @ColumnInfo(name = "ease_factor")
    val easeFactor: Float = 2.5f,
    @ColumnInfo(name = "due_date")
    val dueDate: Long = System.currentTimeMillis()
)

@Dao
interface FlashcardDao {
    @Query("SELECT * FROM flashcards WHERE deck_id = :deckId AND due_date <= :currentTime ORDER BY due_date ASC")
    fun getDueCards(deckId: String, currentTime: Long = System.currentTimeMillis()): Flow<List<FlashcardEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertCards(cards: List<FlashcardEntity>)

    @Update
    suspend fun updateCard(card: FlashcardEntity)

    @Query("DELETE FROM flashcards WHERE id = :cardId")
    suspend fun deleteCard(cardId: String)
}`
      },
      {
        id: 'viewmodel-study',
        title: 'FlashcardViewModel.kt',
        language: 'kotlin',
        category: 'ViewModel',
        description: 'MVVM ViewModel using StateFlow, Coroutines, and clean unidirectional data flow.',
        code: `class StudyViewModel(
    private val repository: FlashcardRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow<StudyUiState>(StudyUiState.Loading)
    val uiState: StateFlow<StudyUiState> = _uiState.asStateFlow()

    fun loadDeck(deckId: String) {
        viewModelScope.launch {
            repository.getDueCards(deckId)
                .catch { error -> _uiState.value = StudyUiState.Error(error.message ?: "Failed to load") }
                .collect { cards ->
                    _uiState.value = if (cards.isEmpty()) {
                        StudyUiState.DeckCompleted
                    } else {
                        StudyUiState.ActiveCard(currentCard = cards.first(), remainingCount = cards.size)
                    }
                }
        }
    }

    fun answerCard(card: FlashcardEntity, quality: Int) {
        viewModelScope.launch {
            val updated = SpacedRepetitionHelper.calculateNextReview(card, quality)
            repository.updateCard(updated)
        }
    }
}

sealed interface StudyUiState {
    data object Loading : StudyUiState
    data class ActiveCard(val currentCard: FlashcardEntity, val remainingCount: Int) : StudyUiState
    data object DeckCompleted : StudyUiState
    data class Error(val message: String) : StudyUiState
}`
      }
    ],
    masterPrompts: [
      {
        targetTool: 'Google AI Studio / Cursor',
        badge: 'Master Blueprint Prompt',
        tips: 'Paste directly into AI Studio or Cursor Composer to generate the entire mobile app skeleton in one go.',
        fullPrompt: `Build a production-ready Android mobile application using Kotlin and Jetpack Compose named "FocusForge".
Follow strict Clean Architecture with MVVM:
- Presentation: Jetpack Compose with Material 3 styling, dynamic color support, and 48dp touch targets.
- Local Storage: Room Database with FlashcardEntity, DeckEntity, and reactive Flow DAO.
- Spaced Repetition Engine: Implement SM-2 algorithm in pure Kotlin domain logic.
- Low-cost architecture: Zero required paid cloud services. App must be 100% functional offline first.
- UI Features: Deck list with progress bars, flashcard study flip view with spring animation, Leitner queue, and study session summary dialog.`
      },
      {
        targetTool: 'Claude Code / v0',
        badge: 'UI & Animation Spec',
        tips: 'Focuses on the visual hierarchy, micro-interactions, and accessibility standards.',
        fullPrompt: `Design an ergonomic flashcard review screen for a mobile app. 
Include:
1. Progress bar showing completed cards vs remaining cards.
2. Central flip card using 3D perspective rotation (rotationY) on tap.
3. Bottom action bar with 3 rating buttons: 'Hard' (amber/red), 'Good' (brand primary), 'Easy' (emerald green).
4. Keyboard shortcut / swipe gesture support (swipe left for repeat, swipe right for pass).
5. Clean minimalist typography using Plus Jakarta Sans and dark mode contrast.`
      }
    ],
    wireframeBlueprint: FOCUS_FORGE_WIREFRAME,
    timestamp: Date.now() - 3600000
  },
  {
    id: 'frugal-hyperlocal-bazaar',
    title: 'BazaarDirect: Zero-Commission Local Farm & Artisan Bazaar',
    tagline: 'Connect neighborhood farmers, home bakers, and carpenters directly with hyper-local buyers without 30% platform cut.',
    category: 'Hyperlocal Marketplace / Social',
    targetAudience: 'Small local producers, organic buyers, and community cooperatives',
    problemStatement: 'DoorDash, UberEats, and Etsy extract 20% to 35% fees from tiny home bakers and organic growers, making micro-businesses unprofitable.',
    coreFeatures: [
      'Proximity-based Catalog using device GPS (Haversine formula in SQLite, zero geo-index server fees)',
      'Direct WhatsApp / UPI / Cash-on-Delivery payment routing (Zero payment gateway transaction overhead)',
      'Community Daily Produce Drop bulletin with real-time push alerts',
      'Vendor Micro-Storefront with WebP-compressed photo showcase',
      'QR Code Verified Pickups'
    ],
    monetization: '100% Free for basic sellers. Optional $5/month verified neighborhood badge or local sponsored pin in weekly newsletter.',
    competitiveEdge: 'Zero transaction commissions. P2P communication directly via WhatsApp and UPI.',
    userFlowSteps: [
      '1. Local baker takes 2 photos of fresh sourdough loaves and enters quantity.',
      '2. App stores listing locally and broadcasts to nearby buyers within 5km.',
      '3. Buyer taps "Order via WhatsApp / UPI" which auto-formats the order message.',
      '4. Pickup is confirmed with a simple offline QR scan.'
    ],
    costOptimization: {
      frugalMonthlyCostEstimate: '$0.00 / month',
      enterpriseMonthlyCostEstimate: '$680.00 / month',
      savingsPercentage: '100% Savings',
      totalWorkloadHoursSaved: '160 dev hours',
      frugalStackRecommendation: [
        {
          layer: 'Payment Gateway',
          highCostSolution: 'Stripe Connect Custom Accounts ($2.9% + 30c per order + $2/mo per vendor)',
          highCostEstimate: '$180/mo',
          frugalSolution: 'Direct UPI / WhatsApp Deep Linking / Cash on Pickup ($0/mo)',
          frugalCostEstimate: '$0/mo',
          howItDoesSameWork: 'Bypasses payment aggregator fees completely. Money goes 100% direct from buyer to seller account.',
          savingsRatio: '100%'
        },
        {
          layer: 'Geospatial Search Engine',
          highCostSolution: 'Algolia Places / AWS Elasticsearch / Google Maps API ($220/mo)',
          highCostEstimate: '$220/mo',
          frugalSolution: 'Android FusedLocationProvider + Local SQLite Haversine Bounding Box ($0/mo)',
          frugalCostEstimate: '$0/mo',
          howItDoesSameWork: 'Calculates distance locally on device using standard trigonometry bounding box queries in SQLite.',
          savingsRatio: '100%'
        },
        {
          layer: 'Server Infrastructure',
          highCostSolution: 'Heroku Eco / AWS ECS Load Balancer ($120/mo)',
          highCostEstimate: '$120/mo',
          frugalSolution: 'Supabase Free Tier (500MB DB, 50k monthly active users) ($0/mo)',
          frugalCostEstimate: '$0/mo',
          howItDoesSameWork: 'Provides instant real-time PostgreSQL database, WebSocket listeners, and row-level security.',
          savingsRatio: '100%'
        },
        {
          layer: 'Image Storage & CDN',
          highCostSolution: 'AWS S3 + CloudFront Data Transfer ($80/mo)',
          highCostEstimate: '$80/mo',
          frugalSolution: 'Client-side WebP compression (80% smaller) + Cloudflare R2 ($0/mo free 10GB)',
          frugalCostEstimate: '$0/mo',
          howItDoesSameWork: 'Cloudflare R2 has ZERO egress fees; compresses 4MB camera photos to 80KB WebP on device before upload.',
          savingsRatio: '100%'
        }
      ],
      actionableHacks: [
        'Use Android native Bitmap.compress(Bitmap.CompressFormat.WEBP_LOSSY, 75, stream) on-device.',
        'Deep link to WhatsApp with android.intent.action.VIEW to pre-fill order details without running SMS servers.',
        'Use OpenStreetMap tiles or native MapLibre rather than paid Google Maps SDK billing.'
      ]
    },
    architecturalBlueprint: {
      pattern: 'Offline-First Compose + Supabase Realtime + Device Geo Filtering',
      frontendLayers: [
        'Catalog Feed: LazyGrid with Staggered layout for artisan goods',
        'Location: FusedLocationProviderClient with Coroutines awaitLocation',
        'Direct Checkout: Intent launcher to WhatsApp & UPI handles'
      ],
      backendLayers: [
        'Database: PostgreSQL with PostGIS / bounding coordinates on Supabase',
        'Storage: Cloudflare R2 bucket with signed upload URLs',
        'Push: Firebase Cloud Messaging (FCM) topic-based subscription per postal code'
      ],
      dataSchemas: [
        {
          tableName: 'products',
          description: 'Items posted by local vendors',
          fields: [
            { name: 'id', type: 'UUID', isPrimary: true },
            { name: 'vendor_id', type: 'UUID', notes: 'References auth.users' },
            { name: 'name', type: 'TEXT', notes: 'Product title' },
            { name: 'price_cents', type: 'INTEGER' },
            { name: 'quantity_available', type: 'INTEGER' },
            { name: 'image_url', type: 'TEXT' },
            { name: 'latitude', type: 'DOUBLE PRECISION' },
            { name: 'longitude', type: 'DOUBLE PRECISION' }
          ]
        }
      ],
      apiEndpoints: [
        {
          method: 'GET',
          endpoint: '/rest/v1/products?latitude=gte.12.9&latitude=lte.13.1',
          description: 'Fetch nearby products within bounding box',
          freeTierImpact: 'Zero cost, indexed B-Tree search'
        }
      ],
      securityConsiderations: [
        'Postgres Row-Level Security ensuring vendors only modify their own stock',
        'No credit card data stored or touched (Zero PCI-DSS compliance headache)'
      ],
      offlineSyncStrategy: 'Cache neighborhood products in Room database. Show cached catalog when offline with banner.'
    },
    codeSnippets: [
      {
        id: 'bazaar-distance',
        title: 'HaversineLocalGeoFilter.kt',
        language: 'kotlin',
        category: 'Repository',
        description: 'Zero-cost client-side geospatial distance calculator without any Google Maps API costs.',
        code: `object GeoCalculator {
    private const val EARTH_RADIUS_KM = 6371.0

    /**
     * Calculates distance between user and vendor locally without calling paid API.
     */
    fun calculateDistanceKm(
        lat1: Double, lon1: Double,
        lat2: Double, lon2: Double
    ): Double {
        val dLat = Math.toRadians(lat2 - lat1)
        val dLon = Math.toRadians(lon2 - lon1)
        val a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2)
        val c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
        return EARTH_RADIUS_KM * c
    }

    fun formatDistance(distanceKm: Double): String {
        return if (distanceKm < 1.0) {
            "\${(distanceKm * 1000).toInt()}m away"
        } else {
            "%.1f km away".format(distanceKm)
        }
    }
}`
      }
    ],
    masterPrompts: [
      {
        targetTool: 'Cursor / AI Studio',
        badge: 'Hyperlocal Architecture Prompt',
        tips: 'Use this prompt to build a zero-cost local marketplace.',
        fullPrompt: `Create a Kotlin Jetpack Compose app for a hyperlocal artisan marketplace called BazaarDirect.
Key rules:
1. Zero paid third party API dependencies. Calculate distances locally using Haversine formula.
2. Orders are placed by opening WhatsApp Intent with pre-filled order text and total price.
3. Clean M3 UI with a 2-column StaggeredGrid showing product photo, price tag, distance badge, and direct buy button.
4. Offline cache using Room database so catalog is always readable.`
      }
    ],
    wireframeBlueprint: BAZAAR_DIRECT_WIREFRAME,
    timestamp: Date.now() - 7200000
  },
  {
    id: 'frugal-micro-saas-audit',
    title: 'BillPulse: Zero-Leak Subscription & Invoice Watchdog',
    tagline: 'Detect zombie recurring software subscriptions, calculate tax deductions, and auto-generate PDF cancellation notices.',
    category: 'Fintech / Micro-SaaS',
    targetAudience: 'Freelancers, remote contractors, and small agency founders',
    problemStatement: 'Freelancers lose $80-$300 every month on forgotten SaaS trials, auto-renewals, and duplicate subscriptions.',
    coreFeatures: [
      'Offline OCR Bank Statement Parser using Google ML Kit on-device (zero cloud OCR cost)',
      'Zombie Subscription Radar with upcoming auto-debit alerts',
      'Tax Deduction Tagging with 1-click CSV/PDF export for accountants',
      'Pre-written Legal Subscription Cancellation Letters in PDF',
      'Currency conversion cache updated once per day'
    ],
    monetization: 'One-time $9.99 pro purchase or $1.99/month for cloud encrypted backup. 100% functionality maintained offline.',
    competitiveEdge: '100% financial privacy. Sensitive bank PDF data never leaves the user phone.',
    userFlowSteps: [
      '1. User imports bank statement PDF or takes photo of physical bill.',
      '2. On-device ML Kit extracts recurring merchant names and billing cycles.',
      '3. App flags 3 zombie subscriptions and calculates monthly burn rate.',
      '4. User taps "Cancel" to get direct one-click cancellation link or letter.'
    ],
    costOptimization: {
      frugalMonthlyCostEstimate: '$0.00 / month',
      enterpriseMonthlyCostEstimate: '$540.00 / month',
      savingsPercentage: '100% Savings',
      totalWorkloadHoursSaved: '140 dev hours',
      frugalStackRecommendation: [
        {
          layer: 'Document OCR & Vision',
          highCostSolution: 'AWS Textract / Google Cloud Vision API ($0.05/page = $150/mo)',
          highCostEstimate: '$150/mo',
          frugalSolution: 'Google ML Kit Text Recognition on-device Android SDK ($0/mo)',
          frugalCostEstimate: '$0/mo',
          howItDoesSameWork: 'Runs 100% on-device NPU/CPU. Free, offline, zero privacy violation.',
          savingsRatio: '100%'
        },
        {
          layer: 'Bank Data Aggregator',
          highCostSolution: 'Plaid API ($2,000/year minimum contract)',
          highCostEstimate: '$200/mo',
          frugalSolution: 'PDF Statement OCR Parser + Manual CSV Import ($0/mo)',
          frugalCostEstimate: '$0/mo',
          howItDoesSameWork: 'Users export free monthly statement from their bank app. No Plaid contract needed.',
          savingsRatio: '100%'
        },
        {
          layer: 'PDF Generation Engine',
          highCostSolution: 'DocuSign API / PDFTron Cloud ($110/mo)',
          highCostEstimate: '$110/mo',
          frugalSolution: 'Android native android.graphics.pdf.PdfDocument ($0/mo)',
          frugalCostEstimate: '$0/mo',
          howItDoesSameWork: 'Generates professional vector PDF files directly using Android SDK canvas.',
          savingsRatio: '100%'
        }
      ],
      actionableHacks: [
        'Use Google ML Kit com.google.mlkit:text-recognition for 100% offline, zero-dollar OCR.',
        'Use android.graphics.pdf.PdfDocument to print invoices and cancellation letters for free.',
        'Store encrypted data in SQLite Room using SQLCipher.'
      ]
    },
    architecturalBlueprint: {
      pattern: 'Client-Only Secure Vault + ML Kit On-Device Vision + Room',
      frontendLayers: [
        'Dashboard: Expense breakdown pie chart & upcoming billing calendar',
        'Import: Android Photo Picker / PDF document SAF picker',
        'Export: Android Storage Access Framework for CSV/PDF files'
      ],
      backendLayers: [
        'Zero backend required! Complete zero server overhead and zero privacy liability.'
      ],
      dataSchemas: [
        {
          tableName: 'subscriptions',
          description: 'Tracked recurring expenses and services',
          fields: [
            { name: 'id', type: 'TEXT', isPrimary: true },
            { name: 'service_name', type: 'TEXT' },
            { name: 'amount', type: 'REAL' },
            { name: 'billing_cycle', type: 'TEXT', notes: 'MONTHLY, ANNUAL, WEEKLY' },
            { name: 'next_billing_date', type: 'INTEGER' },
            { name: 'category', type: 'TEXT', notes: 'SaaS, Streaming, Utility, Fitness' },
            { name: 'is_active', type: 'INTEGER' }
          ]
        }
      ],
      apiEndpoints: [],
      securityConsiderations: [
        'Sensitive financial data stays strictly on user phone',
        'Biometric authentication (BiometricPrompt) to open app'
      ],
      offlineSyncStrategy: 'Standalone local app with optional encrypted Google Drive backup via SAF.'
    },
    codeSnippets: [
      {
        id: 'pdf-gen-snippet',
        title: 'NativePdfGenerator.kt',
        language: 'kotlin',
        category: 'Repository',
        description: 'Zero-cost native Android PDF cancellation letter generator.',
        code: `import android.graphics.Paint
import android.graphics.pdf.PdfDocument
import java.io.OutputStream

object CancellationLetterBuilder {
    fun writeCancellationLetter(
        serviceName: String,
        accountEmail: String,
        outputStream: OutputStream
    ) {
        val document = PdfDocument()
        val pageInfo = PdfDocument.PageInfo.Builder(595, 842, 1).create() // A4
        val page = document.startPage(pageInfo)
        val canvas = page.canvas

        val paint = Paint().apply {
            textSize = 14f
            isAntiAlias = true
        }

        val titlePaint = Paint().apply {
            textSize = 20f
            isFakeBoldText = true
        }

        canvas.drawText("FORMAL NOTICE OF SUBSCRIPTION CANCELLATION", 50f, 60f, titlePaint)
        canvas.drawText("To: \${serviceName} Billing Support", 50f, 110f, paint)
        canvas.drawText("Account Reference: \${accountEmail}", 50f, 135f, paint)
        canvas.drawText("Effective Date: Immediate", 50f, 160f, paint)

        val body = "Please cancel any ongoing subscriptions and recurring billing associated with this account."
        canvas.drawText(body, 50f, 210f, paint)

        document.finishPage(page)
        document.writeTo(outputStream)
        document.close()
    }
}`
      }
    ],
    masterPrompts: [
      {
        targetTool: 'AI Studio / Cursor',
        badge: 'Local Financial Engine Prompt',
        tips: 'Creates a 100% private, zero-server financial tracking mobile app.',
        fullPrompt: `Build a Kotlin Jetpack Compose app named BillPulse to track recurring subscriptions.
Architecture constraints:
1. 100% local-first, zero server costs.
2. Room database with SubscriptionEntity and custom query for upcoming 7-day renewals.
3. Clean modern M3 dark theme dashboard with total monthly spend card and category pill filters.
4. Export cancellation letter using Android native PdfDocument.`
      }
    ],
    wireframeBlueprint: BILL_PULSE_WIREFRAME,
    timestamp: Date.now() - 10800000
  }
];

export const INSPIRATION_HINTS = [
  "Gym workout buddy that works offline without subscription",
  "Hyperlocal food sharing app to stop grocery waste",
  "Freelancer invoice tracker with zero server bills",
  "AI voice task planner for ADHD and busy founders",
  "Micro-SaaS for local barbers and salons with WhatsApp bookings",
  "Language learning app using spaced repetition and speech audio",
  "Plant watering and sunlight tracker with zero cloud database",
  "Personal knowledge base that syncs peer-to-peer"
];
