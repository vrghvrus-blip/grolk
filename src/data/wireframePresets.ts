import { WireframeBlueprint } from '../types';

export const FOCUS_FORGE_WIREFRAME: WireframeBlueprint = {
  appPurpose: 'Turn lecture voice notes and PDF excerpts into bite-sized audio summaries and spaced-repetition flashcards with zero cloud costs.',
  targetAudience: 'University students, self-taught programmers, and certification exam takers studying on smartphones.',
  archetype: 'Micro-Learning & Spaced Repetition (Card-Centric)',
  screens: [
    {
      id: 'screen-deck-hub',
      name: 'Deck Hub & Daily Queue',
      screenType: 'Feed / Dashboard',
      purpose: 'Provide an instant view of due study flashcards and organize decks by subject with one-tap study start.',
      thumbZoneFocus: 'Bottom 35% contains primary FAB and quick study trigger button for one-handed thumb access.',
      elements: [
        {
          id: 'el-1',
          type: 'app_bar',
          title: 'FocusForge Study Hub',
          subtitle: '14-Day Streak 🔥 • 24 Cards Due Today',
          badge: 'Offline Ready',
          uxRationale: 'Displays study momentum immediately at the top to build habit reinforcement.'
        },
        {
          id: 'el-2',
          type: 'hero_card',
          title: 'Daily Review Queue',
          subtitle: 'Estimated time: 6 mins • Algorithm: SM-2 Leitner',
          actionText: 'Start Review (24 Cards)',
          uxRationale: 'Hick’s Law: Eliminates decision fatigue by grouping all due cards into a single prominent action button.'
        },
        {
          id: 'el-3',
          type: 'filter_chips',
          title: 'All Decks',
          subtitle: 'Biology (12) • Algorithms (8) • Spanish (4)',
          uxRationale: 'Segmented chips allow immediate topical filtering without nested sub-menus.'
        },
        {
          id: 'el-4',
          type: 'list_item',
          title: 'Data Structures & Trees',
          subtitle: '94% Mastery • Next review: Today',
          badge: '8 due',
          uxRationale: 'Denormalized card badges provide clear progress feedback.'
        },
        {
          id: 'el-5',
          type: 'list_item',
          title: 'Cellular Respiration & Krebs',
          subtitle: '81% Mastery • Next review: Today',
          badge: '16 due',
          uxRationale: 'Scannable two-line list item meeting Material 3 72dp guideline.'
        },
        {
          id: 'el-6',
          type: 'fab',
          title: 'Record Voice Note or Scan PDF',
          actionText: '+ Note',
          uxRationale: 'Fitts’s Law: Floating action button positioned in bottom-right thumb sweet spot.'
        },
        {
          id: 'el-7',
          type: 'bottom_bar',
          title: 'Navigation',
          subtitle: 'Home • Decks • Mindmap • Settings',
          uxRationale: 'Standard M3 NavigationBar with 4 top-level destinations.'
        }
      ],
      composeCodeSnippet: `@Composable
fun DeckHubScreen(
    onStartReview: () -> Unit,
    onAddNote: () -> Unit
) {
    Scaffold(
        topBar = { TopAppBar(title = { Text("FocusForge Study Hub") }) },
        floatingActionButton = {
            FloatingActionButton(onClick = onAddNote, modifier = Modifier.testTag("fab_add_note")) {
                Icon(Icons.Default.Add, contentDescription = "Add Voice Note")
            }
        },
        bottomBar = { NavigationBar { /* 4 Destinations */ } }
    ) { padding ->
        LazyColumn(modifier = Modifier.padding(padding).padding(16.dp)) {
            item { DailyReviewHeroCard(dueCount = 24, onStart = onStartReview) }
            item { DeckFilterChips() }
            items(mockDecks) { deck -> DeckListItem(deck) }
        }
    }
}`
    },
    {
      id: 'screen-flashcard-review',
      name: 'Flashcard Study & Flip Flow',
      screenType: 'Detail / Inspect',
      purpose: 'Distraction-free spaced-repetition card review session with intuitive 3D flip interaction.',
      thumbZoneFocus: 'Quality scoring buttons (Hard, Good, Easy) span the entire bottom screen width for effortless thumb tapping.',
      elements: [
        {
          id: 'el-201',
          type: 'app_bar',
          title: 'Reviewing: Algorithms',
          subtitle: 'Card 7 of 24 (68% Complete)',
          badge: 'SM-2 Active',
          uxRationale: 'Progress indicator gives real-time dopamine feedback on session completion.'
        },
        {
          id: 'el-202',
          type: 'hero_card',
          title: 'What is the worst-case time complexity of QuickSort?',
          subtitle: 'Tap anywhere on the card to flip and reveal answer',
          actionText: '🔄 Tap to Flip Card',
          uxRationale: 'Large central touch canvas (minimum 320dp height) allows flipping without precision aiming.'
        },
        {
          id: 'el-203',
          type: 'cta_button',
          title: 'O(n²) when pivot selection consistently splits into empty sub-array.',
          subtitle: 'Self-Grade Your Recall Quality:',
          uxRationale: 'Answers revealed with clean typography and high contrast ratio (WCAG AAA).'
        },
        {
          id: 'el-204',
          type: 'stat_row',
          title: 'Hard (1d)',
          subtitle: 'Good (3d) • Easy (6d)',
          actionText: 'Score Answer',
          uxRationale: 'Three rating buttons colored amber, brand primary, and emerald green for instant semantic recognition.'
        }
      ],
      composeCodeSnippet: `@Composable
fun FlashcardStudyScreen(
    card: FlashcardEntity,
    onScore: (Int) -> Unit
) {
    var isFlipped by remember { mutableStateOf(false) }
    Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {
        LinearProgressIndicator(progress = { 0.35f }, modifier = Modifier.fillMaxWidth())
        Spacer(modifier = Modifier.height(16.dp))
        Card(
            modifier = Modifier.weight(1f).fillMaxWidth().clickable { isFlipped = !isFlipped },
            shape = RoundedCornerShape(24.dp)
        ) {
            Box(modifier = Modifier.fillMaxSize().padding(24.dp), contentAlignment = Alignment.Center) {
                Text(text = if (isFlipped) card.backText else card.frontText, style = MaterialTheme.typography.headlineSmall)
            }
        }
        RatingButtonBar(onScore = onScore)
    }
}`
    },
    {
      id: 'screen-audio-import',
      name: 'On-Device Audio & Note Importer',
      screenType: 'Action / Modal',
      purpose: 'Record lecture audio or paste textbook snippets to automatically generate cards using on-device ML.',
      thumbZoneFocus: 'Start/Stop recording button sits in the center-bottom, accompanied by quick preset category chips.',
      elements: [
        {
          id: 'el-301',
          type: 'app_bar',
          title: 'New Study Material',
          subtitle: 'Local On-Device Processing (Zero Cloud Bill)',
          uxRationale: 'Reassures user of instant processing and privacy.'
        },
        {
          id: 'el-302',
          type: 'audio_player',
          title: 'Audio Lecture Recorder',
          subtitle: '03:42 Recorded • 24kbps Opus compressed',
          actionText: '🔴 Tap to Stop Recording',
          uxRationale: 'Real-time waveform visualization gives feedback that audio input is active.'
        },
        {
          id: 'el-303',
          type: 'input_field',
          title: 'Or Paste Plain Notes / Textbook Text',
          subtitle: 'Extracted key concepts will auto-generate 10 flashcards',
          uxRationale: 'Flexible multimodal input: voice note or pasted text.'
        },
        {
          id: 'el-304',
          type: 'cta_button',
          title: 'Generate 10 Flashcards Locally',
          actionText: '⚡ Synthesize Cards',
          uxRationale: 'Frugal UX: Employs client-side regex & heuristics first, falling back to cached Gemini Flash only if needed.'
        }
      ]
    }
  ],
  navigationFlow: [
    {
      fromScreen: 'Deck Hub & Daily Queue',
      toScreen: 'Flashcard Study Flow',
      trigger: 'Tap "Start Review (24 Cards)" or tap any deck card',
      transitionType: 'Shared Axis Z (Enter elevation push)',
      backHandling: 'Hardware Back / Top Up Arrow saves current progress to Room and returns to Hub'
    },
    {
      fromScreen: 'Deck Hub & Daily Queue',
      toScreen: 'On-Device Audio Importer',
      trigger: 'Tap Floating Action Button (+ Note)',
      transitionType: 'Modal Bottom Sheet expansion from bottom',
      backHandling: 'Swipe down gesture or Back key dismisses modal without losing draft'
    },
    {
      fromScreen: 'Flashcard Study Flow',
      toScreen: 'Session Summary & Analytics',
      trigger: 'Score last card in review queue (Card 24/24)',
      transitionType: 'Confetti celebratory reveal + Crossfade',
      backHandling: 'Tap "Done" returns to Deck Hub with updated streak'
    }
  ],
  uxRationales: [
    {
      principleName: 'Fitts’s Law & The One-Handed Thumb Zone',
      howApplied: 'All repetitive study interactions (card flipping, score rating buttons, daily review CTA) are constrained to the bottom 40% of the viewport.',
      benefitToUser: 'Users can comfortably study on packed subways or walking between classes using only one hand with zero finger strain.'
    },
    {
      principleName: 'Hick’s Law (Minimizing Decision Time)',
      howApplied: 'Review screen strips away all non-essential navigation, sidebars, and distracting settings to leave only two states: Read Question -> Grade Answer.',
      benefitToUser: 'Dramatically reduces study friction and procrastination, allowing users to enter a flow state within 30 seconds of launching.'
    },
    {
      principleName: 'Progressive Disclosure',
      howApplied: 'Advanced SM-2 algorithm variables (ease factors, review intervals, tag taxonomy) are tucked inside secondary bottom sheets.',
      benefitToUser: 'Beginners are never overwhelmed by complex spaced-repetition math, while power users can inspect their learning curves on demand.'
    },
    {
      principleName: 'Frugal & Offline-First UX',
      howApplied: 'Instant local updates using Room SQLite. The UI never freezes or displays full-screen loading spinners waiting on network round-trips.',
      benefitToUser: 'App feels instantaneous (sub-16ms frame times), even when studying in subway tunnels or in airplane mode.'
    }
  ]
};

export const BAZAAR_DIRECT_WIREFRAME: WireframeBlueprint = {
  appPurpose: 'Connect neighborhood farmers, micro-bakers, and carpenters directly with hyper-local buyers with zero platform commission.',
  targetAudience: 'Locavores, artisan food lovers, home bakers, and community cooperatives.',
  archetype: 'Hyperlocal Marketplace (Visual Grid + Direct Messaging)',
  screens: [
    {
      id: 'screen-drop-feed',
      name: 'Neighborhood Fresh Drops',
      screenType: 'Feed / Dashboard',
      purpose: 'Show nearby produce and artisan batches sorted by physical proximity within 5km.',
      thumbZoneFocus: 'Bottom sticky bar has neighborhood selector and direct cart/inquiry badge.',
      elements: [
        {
          id: 'b-1',
          type: 'app_bar',
          title: 'BazaarDirect • Indiranagar',
          subtitle: 'Showing drops within 3.5 km • 18 Fresh Today',
          badge: '0% Platform Fee',
          uxRationale: 'Transparency in location and platform ethos prominently communicated.'
        },
        {
          id: 'b-2',
          type: 'search_bar',
          title: 'Search sourdough, organic eggs, honey...',
          actionText: 'Filter',
          uxRationale: 'Search bar at comfortable eye-level with clear placeholder examples.'
        },
        {
          id: 'b-3',
          type: 'filter_chips',
          title: 'Categories',
          subtitle: 'All • Sourdough & Bakes (6) • Farm Veg (8) • Handmade (4)',
          uxRationale: 'Single-row horizontal scrollable filter chips.'
        },
        {
          id: 'b-4',
          type: 'card_grid',
          title: 'Rustic Country Sourdough Loaf',
          subtitle: 'By Maya’s Kitchen • 400m away • $5.00',
          badge: 'Baked 2h ago',
          actionText: 'WhatsApp Order',
          uxRationale: 'Staggered grid cards with high-contrast distance and fresh batch timestamps.'
        },
        {
          id: 'b-5',
          type: 'card_grid',
          title: 'Hydroponic Cherry Tomatoes (500g)',
          subtitle: 'GreenRoof Farm • 1.2km away • $3.50',
          badge: 'Harvested Today',
          actionText: 'WhatsApp Order',
          uxRationale: 'Direct WhatsApp deep link button eliminates payment gateway middleman fees.'
        }
      ]
    },
    {
      id: 'screen-product-detail',
      name: 'Artisan Batch & Story View',
      screenType: 'Detail / Inspect',
      purpose: 'Present high-res WebP photo gallery, producer verification story, and direct order options.',
      thumbZoneFocus: 'Fixed bottom bar with two primary thumb actions: "Message on WhatsApp" and "Call Baker".',
      elements: [
        {
          id: 'b-201',
          type: 'hero_card',
          title: 'Maya’s Artisan Sourdough',
          subtitle: '3 Loaves Remaining Today • Fresh out of stone oven',
          badge: 'Verified Resident Baker',
          uxRationale: 'Hero photography builds trust for artisanal homemade food.'
        },
        {
          id: 'b-202',
          type: 'stat_row',
          title: '$5.00 / Loaf',
          subtitle: 'Payment: Cash on Pickup or Direct UPI (Zero Fees)',
          uxRationale: 'Clear pricing with zero hidden convenience fees.'
        },
        {
          id: 'b-203',
          type: 'cta_button',
          title: 'Order via WhatsApp Intent',
          actionText: '💬 Open WhatsApp with Pre-filled Order',
          uxRationale: 'Bypasses expensive app in-app purchases or SMS server infrastructure.'
        }
      ]
    }
  ],
  navigationFlow: [
    {
      fromScreen: 'Neighborhood Fresh Drops',
      toScreen: 'Artisan Batch & Story View',
      trigger: 'Tap any product card in the 2-column grid',
      transitionType: 'Container Transform (Card expands into full screen)',
      backHandling: 'Top back arrow or edge swipe returns to feed without refreshing'
    },
    {
      fromScreen: 'Artisan Batch & Story View',
      toScreen: 'External WhatsApp / UPI',
      trigger: 'Tap "Order via WhatsApp Intent"',
      transitionType: 'Android Intent Launcher (Deep link)',
      backHandling: 'User switches back to app seamlessly via recents'
    }
  ],
  uxRationales: [
    {
      principleName: 'Jakob’s Law of Familiarity',
      howApplied: 'Employs standard mobile commerce patterns (search top, category chips below, 2-column image cards) so users need zero learning curve.',
      benefitToUser: 'Immediate intuitive navigation; users start purchasing within seconds.'
    },
    {
      principleName: 'Frugal P2P Routing',
      howApplied: 'Bypasses custom in-app chat infrastructure and Stripe/Razorpay accounts by directly dispatching pre-formatted WhatsApp deep links.',
      benefitToUser: 'Zero transaction cuts taken from small neighborhood producers, keeping prices 20% lower for buyers.'
    }
  ]
};

export const BILL_PULSE_WIREFRAME: WireframeBlueprint = {
  appPurpose: 'Detect zombie recurring software subscriptions, calculate tax deductions, and auto-generate legal cancellation notices.',
  targetAudience: 'Freelancers, remote agency founders, and budget-conscious professionals.',
  archetype: 'Financial Watchdog & Utility (Data-Dense Dashboard)',
  screens: [
    {
      id: 'screen-burn-radar',
      name: 'Subscription Burn Radar',
      screenType: 'Feed / Dashboard',
      purpose: 'Display total monthly recurring commitments and alert to zombie subscriptions before auto-debit.',
      thumbZoneFocus: 'Bottom action bar provides 1-tap statement import and filter by renew date.',
      elements: [
        {
          id: 'bp-1',
          type: 'app_bar',
          title: 'BillPulse Watchdog',
          subtitle: '100% On-Device Financial Vault • Zero Bank Logins',
          badge: 'Encrypted',
          uxRationale: 'Reassures user of financial privacy.'
        },
        {
          id: 'bp-2',
          type: 'chart_metric',
          title: '$148.50 / Month Burn Rate',
          subtitle: '⚠️ 2 Zombie Subscriptions Detected ($34/mo potential savings)',
          actionText: 'View Audit',
          uxRationale: 'Color-coded warning draws immediate visual focus to wasted money.'
        },
        {
          id: 'bp-3',
          type: 'list_item',
          title: 'Notion AI Team Plan',
          subtitle: 'Renews Oct 12 • $20.00/mo • Last used: 42 days ago',
          badge: 'Zombie Alert',
          actionText: 'Cancel',
          uxRationale: 'Clear inactivity indicator motivates decisive user action.'
        },
        {
          id: 'bp-4',
          type: 'list_item',
          title: 'Figma Professional',
          subtitle: 'Renews Oct 18 • $15.00/mo • Active daily',
          badge: 'Active',
          uxRationale: 'Differentiates needed tools from idle subscriptions.'
        },
        {
          id: 'bp-5',
          type: 'cta_button',
          title: 'Import Bank PDF or Snap Physical Bill',
          actionText: '📄 Offline Statement OCR',
          uxRationale: 'Uses on-device Google ML Kit text recognition for free, private OCR.'
        }
      ]
    },
    {
      id: 'screen-cancellation-modal',
      name: 'Legal Cancellation Letter Generator',
      screenType: 'Action / Modal',
      purpose: 'Generate an official vector PDF cancellation letter using Android native PdfDocument.',
      thumbZoneFocus: 'Single prominent "Download & Send PDF" button at bottom.',
      elements: [
        {
          id: 'bp-201',
          type: 'app_bar',
          title: 'Formal Notice of Cancellation',
          subtitle: 'Target: Notion Support & Billing',
          uxRationale: 'Preview of legal notice to cancel recurring authorization.'
        },
        {
          id: 'bp-202',
          type: 'cta_button',
          title: 'Generate & Share PDF Letter',
          actionText: '📤 Export Signed PDF',
          uxRationale: 'Zero-cost native Android PDF generator without requiring paid DocuSign APIs.'
        }
      ]
    }
  ],
  navigationFlow: [
    {
      fromScreen: 'Subscription Burn Radar',
      toScreen: 'Legal Cancellation Letter Generator',
      trigger: 'Tap "Cancel" on any zombie subscription card',
      transitionType: 'Slide Up Modal Sheet',
      backHandling: 'Top close X or Back gesture returns to Burn Radar'
    }
  ],
  uxRationales: [
    {
      principleName: 'Miller’s Law & Chunking',
      howApplied: 'Groups monthly expenses into three clean buckets: "Critical Active", "Under Evaluation", and "Zombie Bleed".',
      benefitToUser: 'Users can review their entire monthly financial commitment in under 2 minutes without spreadsheet fatigue.'
    },
    {
      principleName: 'Zero-Liability Financial Privacy',
      howApplied: 'Requires zero Plaid credentials or online banking logins; everything runs via on-device OCR and local Room storage.',
      benefitToUser: 'Complete peace of mind knowing sensitive bank statements never hit a third-party cloud database.'
    }
  ]
};
