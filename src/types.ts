export interface CostComparisonItem {
  layer: string;
  highCostSolution: string;
  highCostEstimate: string;
  frugalSolution: string;
  frugalCostEstimate: string;
  howItDoesSameWork: string;
  savingsRatio: string;
}

export interface CostOptimizationSpec {
  frugalMonthlyCostEstimate: string;
  enterpriseMonthlyCostEstimate: string;
  savingsPercentage: string;
  frugalStackRecommendation: CostComparisonItem[];
  actionableHacks: string[];
  totalWorkloadHoursSaved: string;
}

export interface DataEntitySchema {
  tableName: string;
  description: string;
  fields: { name: string; type: string; isPrimary?: boolean; notes?: string }[];
}

export interface ApiEndpointDoc {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  endpoint: string;
  description: string;
  freeTierImpact: string;
}

export interface ArchitecturalBlueprint {
  pattern: string;
  frontendLayers: string[];
  backendLayers: string[];
  dataSchemas: DataEntitySchema[];
  apiEndpoints: ApiEndpointDoc[];
  securityConsiderations: string[];
  offlineSyncStrategy: string;
}

export interface CodeSnippet {
  id: string;
  title: string;
  language: string;
  category: 'Compose UI' | 'Room Database' | 'ViewModel' | 'Retrofit API' | 'Repository';
  code: string;
  description: string;
}

export interface PromptTemplate {
  targetTool: string;
  badge: string;
  fullPrompt: string;
  tips: string;
}

export interface WireframeElement {
  id: string;
  type: 'app_bar' | 'hero_card' | 'search_bar' | 'filter_chips' | 'list_item' | 'card_grid' | 'fab' | 'bottom_bar' | 'audio_player' | 'chart_metric' | 'cta_button' | 'stat_row' | 'input_field';
  title: string;
  subtitle?: string;
  actionText?: string;
  icon?: string;
  uxRationale?: string;
  badge?: string;
}

export interface WireframeScreen {
  id: string;
  name: string;
  screenType: 'Feed / Dashboard' | 'Detail / Inspect' | 'Action / Modal' | 'Profile / Settings';
  purpose: string;
  thumbZoneFocus: string;
  elements: WireframeElement[];
  composeCodeSnippet?: string;
}

export interface NavigationStep {
  fromScreen: string;
  toScreen: string;
  trigger: string;
  transitionType: string;
  backHandling: string;
}

export interface UxPrincipleRationale {
  principleName: string;
  howApplied: string;
  benefitToUser: string;
}

export interface WireframeBlueprint {
  appPurpose: string;
  targetAudience: string;
  archetype: string;
  screens: WireframeScreen[];
  navigationFlow: NavigationStep[];
  uxRationales: UxPrincipleRationale[];
}

export interface AppIdea {
  id: string;
  title: string;
  tagline: string;
  category: string;
  targetAudience: string;
  problemStatement: string;
  coreFeatures: string[];
  monetization: string;
  competitiveEdge: string;
  userFlowSteps: string[];
  costOptimization: CostOptimizationSpec;
  architecturalBlueprint: ArchitecturalBlueprint;
  codeSnippets: CodeSnippet[];
  masterPrompts: PromptTemplate[];
  wireframeBlueprint?: WireframeBlueprint;
  timestamp: number;
  isBookmarked?: boolean;
}
