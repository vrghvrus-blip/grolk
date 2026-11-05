import { AppIdea, CostOptimizationSpec, ArchitecturalBlueprint, CodeSnippet, PromptTemplate, WireframeBlueprint } from '../types';
import { FOCUS_FORGE_WIREFRAME, BAZAAR_DIRECT_WIREFRAME, BILL_PULSE_WIREFRAME } from '../data/wireframePresets';

export class GeminiService {
  private static apiKey: string = (import.meta as any).env?.VITE_GEMINI_API_KEY || '';

  static setCustomKey(key: string) {
    this.apiKey = key.trim();
    try {
      localStorage.setItem('appforge_gemini_key', this.apiKey);
    } catch (e) {
      // ignore
    }
  }

  static getActiveKey(): string {
    if (this.apiKey) return this.apiKey;
    try {
      const stored = localStorage.getItem('appforge_gemini_key');
      if (stored) {
        this.apiKey = stored;
        return stored;
      }
    } catch (e) {
      // ignore
    }
    return '';
  }

  static async generateIdeaBlueprint(
    promptQuery: string,
    categoryHint: string = 'General',
    budgetFocus: 'frugal' | 'balanced' | 'scale' = 'frugal'
  ): Promise<AppIdea> {
    const key = this.getActiveKey();

    if (key) {
      try {
        const liveResult = await this.callGeminiApi(promptQuery, categoryHint, budgetFocus, key);
        if (liveResult) return liveResult;
      } catch (err) {
        console.warn('Live Gemini API call failed or timed out, falling back to built-in architect engine:', err);
      }
    }

    // Built-in intelligent generator (Instant, resilient, offline-ready)
    return this.synthesizeFrugalBlueprint(promptQuery, categoryHint);
  }

  private static async callGeminiApi(
    query: string,
    categoryHint: string,
    budgetFocus: string,
    apiKey: string
  ): Promise<AppIdea | null> {
    const systemPrompt = `You are AppForge, a Principal Mobile Solutions Architect and Frugal Engineering Specialist.
The user wants to brainstorm or refine a mobile application idea.
CRITICAL MANDATE: Specially emphasize WHERE THE USER CAN USE LESS MONEY AND DO THE SAME WORK (काम).
Compare high-cost enterprise solutions ($400+/mo like AWS RDS, Auth0, managed Kafka, expensive GPT-4o) with smart zero-to-low cost architectures ($0-$10/mo like Room SQLite offline cache, Supabase/Firebase Free Tier, Cloudflare Workers/R2, Gemini 3.5 Flash, on-device ML Kit, direct WhatsApp/UPI payments).

Return a single JSON object matching this exact schema:
{
  "title": "Creative Catchy Name",
  "tagline": "Punchy one-liner",
  "category": "Category",
  "targetAudience": "Specific users",
  "problemStatement": "Core pain point solved",
  "coreFeatures": ["Feature 1", "Feature 2", "Feature 3", "Feature 4", "Feature 5"],
  "monetization": "Honest sustainable monetization",
  "competitiveEdge": "Why it wins with lower overhead",
  "userFlowSteps": ["Step 1", "Step 2", "Step 3", "Step 4"],
  "costOptimization": {
    "frugalMonthlyCostEstimate": "$0 - $5 / month",
    "enterpriseMonthlyCostEstimate": "$380 - $750 / month",
    "savingsPercentage": "98% Savings",
    "totalWorkloadHoursSaved": "140 dev hours",
    "frugalStackRecommendation": [
      {
        "layer": "Database / Backend",
        "highCostSolution": "AWS RDS + EC2 ($160/mo)",
        "highCostEstimate": "$160/mo",
        "frugalSolution": "Room SQLite on-device + Supabase Free ($0/mo)",
        "frugalCostEstimate": "$0/mo",
        "howItDoesSameWork": "Caches 95% of reads locally, cloud sync in background.",
        "savingsRatio": "100%"
      }
    ],
    "actionableHacks": ["Specific frugal engineering tip 1", "Tip 2", "Tip 3"]
  },
  "architecturalBlueprint": {
    "pattern": "Clean Architecture + MVVM + Offline First",
    "frontendLayers": ["Jetpack Compose UI", "ViewModel StateFlow", "Domain Repository"],
    "backendLayers": ["Local Room DB", "Serverless Sync", "Retrofit Client"],
    "dataSchemas": [
      {
        "tableName": "items",
        "description": "Primary entity",
        "fields": [{"name": "id", "type": "TEXT", "isPrimary": true}]
      }
    ],
    "apiEndpoints": [
      {"method": "POST", "endpoint": "/api/sync", "description": "Delta sync", "freeTierImpact": "Zero cost"}
    ],
    "securityConsiderations": ["Security rule 1"],
    "offlineSyncStrategy": "Strategy description"
  },
  "codeSnippets": [
    {
      "id": "snippet-1",
      "title": "MainScreen.kt",
      "language": "kotlin",
      "category": "Compose UI",
      "description": "Jetpack Compose implementation",
      "code": "// Kotlin Compose code"
    }
  ],
  "masterPrompts": [
    {
      "targetTool": "Google AI Studio",
      "badge": "Master App Prompt",
      "fullPrompt": "Full instruction prompt...",
      "tips": "Tips to copy paste"
    }
  ]
}`;

    const userPrompt = `User query / rough idea: "${query}". Category focus: "${categoryHint}". Budget focus: "${budgetFocus}".
Generate the complete mobile app idea, frugal cost breakdown, architecture, code snippets, and copyable prompts now as pure valid JSON.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.7,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error status: ${response.status}`);
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) return null;

    const parsed = JSON.parse(rawText);
    return {
      ...parsed,
      id: 'gen-' + Date.now(),
      timestamp: Date.now(),
    };
  }

  static synthesizeFrugalBlueprint(query: string, categoryHint: string): AppIdea {
    const cleanQuery = query.trim() || 'Smart Mobile Utility';
    const id = 'idea-' + Date.now();

    // Determine domain flavor
    const isHealth = /gym|fit|health|diet|workout|habit|sleep/i.test(cleanQuery);
    const isLocal = /local|food|grocery|market|store|barber|near/i.test(cleanQuery);
    const isAi = /ai|voice|bot|summary|chat|prompt|image/i.test(cleanQuery);
    const isMoney = /money|invoice|tax|budget|spend|crypto|bank/i.test(cleanQuery);

    let title = `${cleanQuery.slice(0, 24).replace(/[^a-zA-Z0-9 ]/g, '')}Forge`;
    if (title.length < 8) title = `Nexus${cleanQuery.replace(/[^a-zA-Z0-9]/g, '')}`;

    let category = categoryHint !== 'General' ? categoryHint : (
      isHealth ? 'Health & Longevity' :
      isLocal ? 'Hyperlocal Commerce' :
      isAi ? 'AI Workflow & Voice' :
      isMoney ? 'Fintech & Micro-SaaS' : 'Productivity & Tooling'
    );

    const costSpec: CostOptimizationSpec = {
      frugalMonthlyCostEstimate: '$0.00 - $3.50 / month',
      enterpriseMonthlyCostEstimate: '$450.00 - $820.00 / month',
      savingsPercentage: '99% Savings',
      totalWorkloadHoursSaved: '135 engineering hours',
      frugalStackRecommendation: [
        {
          layer: 'Database & Sync',
          highCostSolution: 'AWS RDS Postgres Multi-AZ + DynamoDB ($220/mo)',
          highCostEstimate: '$220/mo',
          frugalSolution: 'Android Room (SQLite) on-device + Supabase Free Tier ($0/mo)',
          frugalCostEstimate: '$0/mo',
          howItDoesSameWork: 'Room keeps 100% of read and write queries local on the user device with zero latency; only synced deltas hit the cloud free tier.',
          savingsRatio: '100%'
        },
        {
          layer: 'User Authentication',
          highCostSolution: 'Auth0 / Okta Enterprise ($140/mo at scale)',
          highCostEstimate: '$140/mo',
          frugalSolution: 'Google Identity Services (Jetpack Credential Manager) ($0/mo)',
          frugalCostEstimate: '$0/mo',
          howItDoesSameWork: 'Provides instant 1-tap Google Sign-In with verified OAuth tokens and zero per-user seat fees.',
          savingsRatio: '100%'
        },
        {
          layer: 'Intelligence & LLM API',
          highCostSolution: 'OpenAI GPT-4o / Claude 3.5 Opus with heavy prompt payload ($180/mo)',
          highCostEstimate: '$180/mo',
          frugalSolution: 'Gemini 3.5 Flash with cached prompts & on-device regex ($2-$5/mo)',
          frugalCostEstimate: '$3/mo',
          howItDoesSameWork: 'Gemini 3.5 Flash is 20x cheaper per token, handles 1M token context, and responds in under 400ms.',
          savingsRatio: '98%'
        },
        {
          layer: 'File & Asset Hosting',
          highCostSolution: 'AWS S3 + CloudFront Data Transfer Out ($80/mo)',
          highCostEstimate: '$80/mo',
          frugalSolution: 'Cloudflare R2 (10GB Free, 0 Egress Bandwidth Fees) ($0/mo)',
          frugalCostEstimate: '$0/mo',
          howItDoesSameWork: 'Zero bandwidth egress fees forever. Compressing images locally to WebP before upload cuts storage by 80%.',
          savingsRatio: '100%'
        },
        {
          layer: 'Push Notifications',
          highCostSolution: 'OneSignal Paid Tier ($99/mo)',
          highCostEstimate: '$99/mo',
          frugalSolution: 'Firebase Cloud Messaging (FCM) Native ($0/mo)',
          frugalCostEstimate: '$0/mo',
          howItDoesSameWork: 'FCM is 100% free with unlimited push notifications directly through Google Play Services.',
          savingsRatio: '100%'
        }
      ],
      actionableHacks: [
        'कम खर्च hack: Do not send raw user keystrokes to the cloud. Debounce text input and perform fuzzy filtering inside SQLite Room.',
        'Use WebP image compression on Android before upload: Reduces file size from 4MB to 90KB with zero visible loss.',
        'Use Jetpack Compose single codebase with clean MVVM to eliminate having two separate iOS and Android engineering teams.'
      ]
    };

    const architecturalBlueprint: ArchitecturalBlueprint = {
      pattern: 'Offline-First Clean Architecture (Presentation, Domain, Data)',
      frontendLayers: [
        'Jetpack Compose UI: Declarative, reactive, strict Material 3 styling',
        'State Management: ViewModel with Kotlin StateFlow and UI State sealed classes',
        'Navigation: Type-safe Compose navigation with backstack handling'
      ],
      backendLayers: [
        'Local Layer: Android Room SQLite database (Single Source of Truth)',
        'Network Layer: OkHttp + Retrofit with Moshi serialization',
        'Background Sync: Android WorkManager with exponential backoff'
      ],
      dataSchemas: [
        {
          tableName: 'app_records',
          description: 'Primary persistent entity for ' + cleanQuery,
          fields: [
            { name: 'id', type: 'TEXT', isPrimary: true, notes: 'UUID v4' },
            { name: 'title', type: 'TEXT', notes: 'Display name' },
            { name: 'payload_json', type: 'TEXT', notes: 'Serialized metadata' },
            { name: 'created_at', type: 'INTEGER', notes: 'Timestamp' },
            { name: 'is_synced', type: 'INTEGER', notes: '0 = pending, 1 = synced' }
          ]
        },
        {
          tableName: 'user_preferences',
          description: 'Local app settings and offline flags',
          fields: [
            { name: 'pref_key', type: 'TEXT', isPrimary: true },
            { name: 'pref_value', type: 'TEXT' },
            { name: 'updated_at', type: 'INTEGER' }
          ]
        }
      ],
      apiEndpoints: [
        {
          method: 'POST',
          endpoint: '/api/v1/sync/batch',
          description: 'Upload pending offline records in a single bulk HTTP request',
          freeTierImpact: 'Cuts API calls by 90%, easily staying in free tier'
        },
        {
          method: 'GET',
          endpoint: '/api/v1/updates?since={timestamp}',
          description: 'Delta fetch for items modified after timestamp',
          freeTierImpact: 'Zero wasted egress bandwidth'
        }
      ],
      securityConsiderations: [
        'API keys kept in BuildConfig injected via .env (never hardcoded in source)',
        'User tokens stored in Android EncryptedSharedPreferences',
        'Strict HTTPS certificate pinning and TLS 1.3 enforced'
      ],
      offlineSyncStrategy: 'Repository queries Room first. UI observes Flow<List<Entity>>. Background sync updates Room, triggering instant UI updates.'
    };

    const codeSnippets: CodeSnippet[] = [
      {
        id: 'ui-compose-' + id,
        title: 'AppForgeMainScreen.kt',
        language: 'kotlin',
        category: 'Compose UI',
        description: 'Clean responsive Jetpack Compose screen with Material 3 cards, state handling, and 48dp minimum touch targets.',
        code: `@Composable
fun MainScreen(
    viewModel: MainViewModel,
    onNavigateDetail: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("${title}", fontWeight = FontWeight.Bold) },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.surface
                )
            )
        },
        modifier = modifier.fillMaxSize()
    ) { innerPadding ->
        when (val state = uiState) {
            is UiState.Loading -> {
                Box(
                    modifier = Modifier.fillMaxSize().padding(innerPadding),
                    contentAlignment = Alignment.Center
                ) {
                    CircularProgressIndicator(modifier = Modifier.testTag("loading_spinner"))
                }
            }
            is UiState.Success -> {
                LazyColumn(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(innerPadding)
                        .padding(horizontal = 16.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    item {
                        CostSavingsBanner(savings = "${costSpec.savingsPercentage}")
                    }
                    items(state.items, key = { it.id }) { item ->
                        ItemCard(
                            item = item,
                            onClick = { onNavigateDetail(item.id) },
                            modifier = Modifier.testTag("item_\${item.id}")
                        )
                    }
                }
            }
            is UiState.Error -> {
                ErrorView(
                    message = state.message,
                    onRetry = { viewModel.refresh() },
                    modifier = Modifier.padding(innerPadding)
                )
            }
        }
    }
}`
      },
      {
        id: 'room-dao-' + id,
        title: 'AppLocalDatabase.kt',
        language: 'kotlin',
        category: 'Room Database',
        description: 'Room Entity and DAO with reactive Kotlin Flow for zero-latency local caching.',
        code: `@Entity(tableName = "app_records")
data class AppRecordEntity(
    @PrimaryKey
    val id: String = UUID.randomUUID().toString(),
    @ColumnInfo(name = "title")
    val title: String,
    @ColumnInfo(name = "payload_json")
    val payloadJson: String,
    @ColumnInfo(name = "created_at")
    val createdAt: Long = System.currentTimeMillis(),
    @ColumnInfo(name = "is_synced")
    val isSynced: Boolean = false
)

@Dao
interface AppRecordDao {
    @Query("SELECT * FROM app_records ORDER BY created_at DESC")
    fun getAllRecords(): Flow<List<AppRecordEntity>>

    @Query("SELECT * FROM app_records WHERE is_synced = 0")
    suspend fun getPendingSyncRecords(): List<AppRecordEntity>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun upsertRecord(record: AppRecordEntity)

    @Query("UPDATE app_records SET is_synced = 1 WHERE id IN (:ids)")
    suspend fun markAsSynced(ids: List<String>)
}`
      },
      {
        id: 'viewmodel-' + id,
        title: 'MainViewModel.kt',
        language: 'kotlin',
        category: 'ViewModel',
        description: 'MVI/MVVM ViewModel maintaining StateFlow and unidirectional data flow.',
        code: `class MainViewModel(
    private val repository: AppRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow<UiState>(UiState.Loading)
    val uiState: StateFlow<UiState> = _uiState.asStateFlow()

    init {
        observeData()
    }

    private fun observeData() {
        viewModelScope.launch {
            repository.recordsStream
                .catch { e -> _uiState.value = UiState.Error(e.message ?: "Unknown error") }
                .collect { list ->
                    _uiState.value = UiState.Success(items = list)
                }
        }
    }

    fun syncPending() {
        viewModelScope.launch {
            repository.syncPendingChanges()
        }
    }
}

sealed interface UiState {
    data object Loading : UiState
    data class Success(val items: List<AppRecordEntity>) : UiState
    data class Error(val message: String) : UiState
}`
      }
    ];

    const masterPrompts: PromptTemplate[] = [
      {
        targetTool: 'Google AI Studio Build',
        badge: 'AI Studio System Prompt',
        tips: 'Paste into Google AI Studio to let Gemini build the entire mobile app skeleton with zero wasted steps.',
        fullPrompt: `You are an expert Android developer. Build a production-grade Kotlin Jetpack Compose app named "${title}".
Key Requirements:
1. Architectural Blueprint: Clean Architecture + MVVM + Offline-First Room database.
2. Low-Cost Guarantee (काम): Zero required paid external infrastructure. All primary user flows must operate locally on device.
3. UI: Material Design 3, dynamic theme, smooth spring animations, and 48dp touch targets with testTag on all buttons.
4. Feature Set:
${costSpec.actionableHacks.map(h => `- ${h}`).join('\n')}
Provide complete Kotlin code with zero placeholder mocks.`
      },
      {
        targetTool: 'Cursor / Claude Code',
        badge: 'IDE Multi-File Prompt',
        tips: 'Ready for Cursor Composer or Claude Code for multi-file generation.',
        fullPrompt: `Generate the complete folder structure and Kotlin code for "${title}":
- data/local: AppDatabase.kt, AppRecordDao.kt, AppRecordEntity.kt
- data/repository: AppRepository.kt (Room + optional Retrofit sync)
- ui/screens: MainScreen.kt, DetailScreen.kt, CostAdvisorScreen.kt
- ui/theme: Color.kt, Theme.kt, Type.kt
Emphasize frugal architecture with zero paid cloud bloat.`
      }
    ];

    const wireframeBlueprint = this.synthesizeWireframeBlueprint(
      `${title}: ${cleanQuery}`,
      'Everyday mobile users looking for speed, privacy, and zero subscription traps.',
      category
    );

    return {
      id,
      title,
      tagline: `The low-overhead, offline-first mobile solution for ${cleanQuery}.`,
      category,
      targetAudience: 'Everyday mobile users looking for speed, privacy, and zero subscription traps.',
      problemStatement: `Current solutions in this space charge $10-$30/month or rely on fragile cloud servers that fail when offline. ${title} delivers 10x the speed at 1/10th the cost.`,
      coreFeatures: [
        `Instant Zero-Latency Local Processing: Operates 100% offline via SQLite Room`,
        `Low-Cost Smart Sync: Batches cloud synchronization to stay within free-tier limits`,
        `Frugal Tech Stack: Zero expensive API subscriptions or heavy cloud server dependencies`,
        `Export & Portability: 1-click JSON/CSV export without platform lock-in`,
        `Biometric Security: Secure on-device hardware protection via BiometricPrompt`
      ],
      monetization: 'Free core utility with optional one-time tip or $3.99 lifetime power-user unlock.',
      competitiveEdge: `Achieves the exact same output as bloated venture-backed apps with $0/month server overhead.`,
      userFlowSteps: [
        '1. User launches app; immediate access with zero mandatory login gates.',
        '2. Actions save directly to local Room SQLite cache in < 15ms.',
        '3. If online, background worker syncs delta changes to free cloud tier.',
        '4. Visual insights and cost breakdowns update reactively in real time.'
      ],
      costOptimization: costSpec,
      architecturalBlueprint,
      codeSnippets,
      masterPrompts,
      wireframeBlueprint,
      timestamp: Date.now()
    };
  }

  static async generateWireframesForPurpose(
    purpose: string,
    audience: string,
    archetypeHint: string = 'Material 3 Responsive Mobile'
  ): Promise<WireframeBlueprint> {
    const key = this.getActiveKey();

    if (key) {
      try {
        const liveResult = await this.callGeminiWireframeApi(purpose, audience, archetypeHint, key);
        if (liveResult) return liveResult;
      } catch (err) {
        console.warn('Live Gemini Wireframe API call failed, falling back to built-in UX layout engine:', err);
      }
    }

    return this.synthesizeWireframeBlueprint(purpose, audience, archetypeHint);
  }

  private static async callGeminiWireframeApi(
    purpose: string,
    audience: string,
    archetypeHint: string,
    apiKey: string
  ): Promise<WireframeBlueprint | null> {
    const systemPrompt = `You are AppForge Mobile UX & UI Design Architect.
Given a mobile application's Core Purpose and Target Audience, generate intuitive UI wireframes, screen designs, navigation flows, and UX design principle rationales (Fitts's Law, Hick's Law, Jakob's Law, Progressive Disclosure, Thumb Zone, Accessibility).

Return a valid JSON matching this exact schema:
{
  "appPurpose": "App core purpose",
  "targetAudience": "Target audience",
  "archetype": "Design archetype",
  "screens": [
    {
      "id": "screen-1",
      "name": "Screen Title",
      "screenType": "Feed / Dashboard",
      "purpose": "Screen role",
      "thumbZoneFocus": "Thumb zone explanation",
      "elements": [
        {
          "id": "el-1",
          "type": "app_bar",
          "title": "Title",
          "subtitle": "Subtitle",
          "actionText": "Action",
          "badge": "Badge",
          "uxRationale": "Why this design choice helps UX"
        }
      ],
      "composeCodeSnippet": "@Composable fun MyScreen() { /* Jetpack Compose code */ }"
    }
  ],
  "navigationFlow": [
    {
      "fromScreen": "Screen 1",
      "toScreen": "Screen 2",
      "trigger": "Tap card",
      "transitionType": "Shared Axis Z",
      "backHandling": "Hardware back pops back"
    }
  ],
  "uxRationales": [
    {
      "principleName": "Fitts’s Law",
      "howApplied": "How it is applied in this app",
      "benefitToUser": "Direct UX benefit"
    }
  ]
}`;

    const userPrompt = `Core Purpose: "${purpose}". Target Audience: "${audience}". Archetype: "${archetypeHint}".
Generate 3 to 4 comprehensive mobile screens with components, navigation flow, and UX design rationales as pure valid JSON.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.6,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) return null;

    return JSON.parse(rawText) as WireframeBlueprint;
  }

  static synthesizeWireframeBlueprint(
    purpose: string,
    audience: string,
    archetypeHint: string = 'Material 3 Responsive Mobile'
  ): WireframeBlueprint {
    const cleanPurpose = purpose.trim() || 'Intuitive Task & Habit Companion';
    const cleanAudience = audience.trim() || 'Busy mobile professionals and everyday smartphone users';

    const isStudy = /study|learn|flashcard|deck|quiz|exam|note/i.test(cleanPurpose);
    const isMarket = /market|bazaar|food|farm|produce|shop|grocery|buy|sell/i.test(cleanPurpose);
    const isFinance = /money|bill|subscription|bank|invoice|spend|tax|budget/i.test(cleanPurpose);
    const isHealth = /gym|fit|workout|health|diet|habit|run|exercise/i.test(cleanPurpose);

    if (isStudy) {
      return {
        ...FOCUS_FORGE_WIREFRAME,
        appPurpose: cleanPurpose,
        targetAudience: cleanAudience,
      };
    }

    if (isMarket) {
      return {
        ...BAZAAR_DIRECT_WIREFRAME,
        appPurpose: cleanPurpose,
        targetAudience: cleanAudience,
      };
    }

    if (isFinance) {
      return {
        ...BILL_PULSE_WIREFRAME,
        appPurpose: cleanPurpose,
        targetAudience: cleanAudience,
      };
    }

    if (isHealth) {
      return {
        appPurpose: cleanPurpose,
        targetAudience: cleanAudience,
        archetype: 'Health & Habit Tracking (Progress Rings + Quick Log)',
        screens: [
          {
            id: 'scr-health-1',
            name: 'Daily Streak & Activity Rings',
            screenType: 'Feed / Dashboard',
            purpose: 'Instant morning visual glance at active streaks, recovery score, and today’s goals.',
            thumbZoneFocus: 'Bottom 30% features oversized "Log Workout" floating button and tab bar.',
            elements: [
              {
                id: 'he-1',
                type: 'app_bar',
                title: 'Daily Longevity Dashboard',
                subtitle: 'Streak: 18 Days 🔥 • Recovery: 92%',
                badge: '100% Offline',
                uxRationale: 'Dopamine loop triggered instantly upon launch via clear streak status.'
              },
              {
                id: 'he-2',
                type: 'chart_metric',
                title: '3 Active Rings (Move, Hydrate, Sleep)',
                subtitle: '78% of daily targets reached by 2:00 PM',
                actionText: 'View Details',
                uxRationale: 'Visual progress rings leverage the Goal-Gradient Effect: users complete goals faster when near the finish line.'
              },
              {
                id: 'he-3',
                type: 'filter_chips',
                title: 'Quick Filter',
                subtitle: 'Today • Weekly Trend • Biometrics',
                uxRationale: 'Segmented chips let user switch timeframes without leaving the view.'
              },
              {
                id: 'he-4',
                type: 'list_item',
                title: 'Morning Zone 2 Cardio (35m)',
                subtitle: 'Completed 7:15 AM • Avg HR: 132 bpm',
                badge: 'Completed',
                uxRationale: 'Checkmark icons provide clear confirmation of logged activity.'
              },
              {
                id: 'he-5',
                type: 'fab',
                title: 'Log Activity',
                actionText: '+ Log Activity',
                uxRationale: 'Fitts’s Law: Primary action in bottom-right corner for effortless one-handed reach.'
              }
            ],
            composeCodeSnippet: `@Composable
fun HealthDashboardScreen(onLogActivity: () -> Unit) {
    Scaffold(
        topBar = { TopAppBar(title = { Text("Daily Longevity Dashboard") }) },
        floatingActionButton = {
            FloatingActionButton(onClick = onLogActivity) {
                Icon(Icons.Default.Add, contentDescription = "Log Activity")
            }
        }
    ) { padding ->
        LazyColumn(modifier = Modifier.padding(padding).padding(16.dp)) {
            item { ActivityRingsHeroCard(progress = 0.78f) }
            items(dailyActivities) { activity -> ActivityListItem(activity) }
        }
    }
}`
          },
          {
            id: 'scr-health-2',
            name: 'Quick Activity Logger',
            screenType: 'Action / Modal',
            purpose: 'Log workout sets or hydration in under 5 seconds with zero typing.',
            thumbZoneFocus: 'Number steppers and category chips sit right above the keyboard area for thumb entry.',
            elements: [
              {
                id: 'he-201',
                type: 'app_bar',
                title: 'Log Session',
                subtitle: 'Zero cloud latency; saves to Room SQLite',
                uxRationale: 'No loading spinners required; saves locally in < 15ms.'
              },
              {
                id: 'he-202',
                type: 'stat_row',
                title: 'Duration: 45 min',
                subtitle: 'Intensity: Moderate (RPE 7)',
                actionText: 'Adjust Stepper',
                uxRationale: 'Steppers eliminate need for on-screen software keyboard, saving screen space.'
              },
              {
                id: 'he-203',
                type: 'cta_button',
                title: 'Save Activity Entry',
                actionText: '✓ Save Entry',
                uxRationale: 'High-contrast emerald button spanning full width for confident tap.'
              }
            ]
          }
        ],
        navigationFlow: [
          {
            fromScreen: 'Daily Streak & Activity Rings',
            toScreen: 'Quick Activity Logger',
            trigger: 'Tap Floating Action Button (+ Log Activity)',
            transitionType: 'Slide Up Modal Sheet',
            backHandling: 'Swipe down or back gesture dismisses modal cleanly'
          }
        ],
        uxRationales: [
          {
            principleName: 'Goal-Gradient Effect',
            howApplied: 'Visual circular completion rings make progress visible, encouraging users to close remaining gaps before midnight.',
            benefitToUser: 'Higher habit adherence and motivation to complete daily goals.'
          },
          {
            principleName: 'Fitts’s Law (Thumb Ergonomics)',
            howApplied: 'Logging buttons and duration steppers are pinned in the lower half of the screen.',
            benefitToUser: 'Users sweaty at the gym can log exercises with one hand without dropping their phone.'
          }
        ]
      };
    }

    // Default High-Polish M3 Architecture Wireframe
    return {
      appPurpose: cleanPurpose,
      targetAudience: cleanAudience,
      archetype: archetypeHint,
      screens: [
        {
          id: 'scr-gen-1',
          name: 'Main Workspace & Priority Stream',
          screenType: 'Feed / Dashboard',
          purpose: `Central hub tailored for ${cleanAudience}; surfaces key actions and priority status immediately.`,
          thumbZoneFocus: 'Lower 35% contains primary interaction CTA and thumb-friendly navigation bar.',
          elements: [
            {
              id: 'ge-1',
              type: 'app_bar',
              title: `${cleanPurpose.slice(0, 20)} Hub`,
              subtitle: 'Active & Offline Ready • 0 Pending Syncs',
              badge: 'Fast Local Cache',
              uxRationale: 'Immediate orientation and reassurance of app responsiveness.'
            },
            {
              id: 'ge-2',
              type: 'hero_card',
              title: 'Primary Priority Focus',
              subtitle: 'Next recommended action based on context',
              actionText: 'Continue Action →',
              uxRationale: 'Hick’s Law: A single prominent primary CTA prevents cognitive decision overload.'
            },
            {
              id: 'ge-3',
              type: 'search_bar',
              title: 'Search items, tags, or records...',
              uxRationale: 'Instant local fuzzy search through Room SQLite without server delay.'
            },
            {
              id: 'ge-4',
              type: 'filter_chips',
              title: 'Filter Categories',
              subtitle: 'All • Active • Saved • Archive',
              uxRationale: 'Horizontal chips provide single-tap filtering.'
            },
            {
              id: 'ge-5',
              type: 'list_item',
              title: 'Primary Work Item 01',
              subtitle: 'Updated 10m ago • Priority High',
              badge: 'Ready',
              uxRationale: 'Material 3 list item with clear status badge and 48dp touch target.'
            },
            {
              id: 'ge-6',
              type: 'bottom_bar',
              title: 'Navigation',
              subtitle: 'Workspace • Insights • Settings',
              uxRationale: 'Material 3 NavigationBar with active pill indicators and TalkBack descriptions.'
            }
          ],
          composeCodeSnippet: `@Composable
fun WorkspaceDashboardScreen(
    onOpenItem: (String) -> Unit,
    onNewItem: () -> Unit
) {
    Scaffold(
        topBar = { TopAppBar(title = { Text("Workspace Hub") }) },
        bottomBar = { NavigationBar { /* Navigation Items */ } }
    ) { padding ->
        LazyColumn(modifier = Modifier.padding(padding).padding(16.dp)) {
            item { HeroFocusCard(onAction = onNewItem) }
            item { SearchAndFilterRow() }
            items(mockItems) { item -> ItemCard(item, onClick = { onOpenItem(item.id) }) }
        }
    }
}`
        },
        {
          id: 'scr-gen-2',
          name: 'Item Detail & Deep Inspect',
          screenType: 'Detail / Inspect',
          purpose: 'Dedicated focused view to inspect, edit, or collaborate on a specific record with zero clutter.',
          thumbZoneFocus: 'Bottom action strip provides secondary actions (share, export, bookmark) in comfortable reach.',
          elements: [
            {
              id: 'ge-201',
              type: 'app_bar',
              title: 'Record Detail Overview',
              subtitle: 'ID: #4092 • Last modified today',
              uxRationale: 'Top back arrow ensures predictable Jakob’s Law navigation.'
            },
            {
              id: 'ge-202',
              type: 'hero_card',
              title: 'Specification & Metadata',
              subtitle: 'Full attributes with offline-first local validation',
              uxRationale: 'High-contrast typographic hierarchy separates header from body.'
            },
            {
              id: 'ge-203',
              type: 'cta_button',
              title: 'Commit Changes / Export',
              actionText: 'Save to Vault',
              uxRationale: 'Fitts’s Law: Full-width button with 56dp height ensures high tap confidence.'
            }
          ]
        },
        {
          id: 'scr-gen-3',
          name: 'Quick Action Modal Sheet',
          screenType: 'Action / Modal',
          purpose: 'Fast modal capture sheet for entering new data without losing context in the background.',
          thumbZoneFocus: 'Form inputs start at mid-screen and submission button rests at the very bottom.',
          elements: [
            {
              id: 'ge-301',
              type: 'app_bar',
              title: 'New Capture Entry',
              subtitle: 'Drag down or tap backdrop to dismiss',
              uxRationale: 'BottomSheet handle provides clear affordance that view is draggable.'
            },
            {
              id: 'ge-302',
              type: 'input_field',
              title: 'Title / Description',
              subtitle: 'Type or use speech-to-text',
              uxRationale: 'Floating label textfield adhering to Material 3 accessibility standards.'
            },
            {
              id: 'ge-303',
              type: 'cta_button',
              title: 'Confirm and Save',
              actionText: '✓ Add Entry',
              uxRationale: 'Instant optimistic local update gives immediate feedback.'
            }
          ]
        }
      ],
      navigationFlow: [
        {
          fromScreen: 'Main Workspace & Priority Stream',
          toScreen: 'Item Detail & Deep Inspect',
          trigger: 'Tap any list item card',
          transitionType: 'Container Transform (Shared element morph)',
          backHandling: 'Top back button or system back gesture pops backstack'
        },
        {
          fromScreen: 'Main Workspace & Priority Stream',
          toScreen: 'Quick Action Modal Sheet',
          trigger: 'Tap "+ Action" or Floating Button',
          transitionType: 'Modal BottomSheet expand from bottom edge',
          backHandling: 'Downward swipe or back key dismisses modal safely'
        }
      ],
      uxRationales: [
        {
          principleName: 'Fitts’s Law & Thumb Zone Optimization',
          howApplied: 'Frequently tapped targets (action buttons, filter chips, navigation icons) are located in the lower 40% of the screen.',
          benefitToUser: 'Reduces grip readjustment and prevents accidental drops during one-handed mobile use.'
        },
        {
          principleName: 'Hick’s Law (Decision Reduction)',
          howApplied: 'Limits primary choices on each screen to 1-2 distinct actions, with secondary choices progressively disclosed.',
          benefitToUser: 'Users navigate with speed and clarity, avoiding the paralysis of complex multi-option dashboards.'
        },
        {
          principleName: 'Jakob’s Law of Familiarity',
          howApplied: 'Uses established Android Material 3 navigation paradigms: top app bar with back navigation, standard bottom navigation bar, and bottom sheets.',
          benefitToUser: 'No cognitive retraining required; users immediately know how to operate the app on first launch.'
        },
        {
          principleName: 'Progressive Disclosure',
          howApplied: 'Complex configurations, filters, and batch operations are revealed only on demand via bottom sheets.',
          benefitToUser: 'Keeps everyday screens clean and approachable for novices while providing power tools to advanced users.'
        }
      ]
    };
  }
}

