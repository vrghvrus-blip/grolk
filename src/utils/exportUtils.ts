import { AppIdea, CodeSnippet } from '../types';

export interface ExportOptions {
  includeOverview?: boolean;
  includeCostMatrix?: boolean;
  includeArchitecture?: boolean;
  includeSchemas?: boolean;
  includeWireframes?: boolean;
  includeSnippets?: boolean;
  includePrompts?: boolean;
}

const DEFAULT_OPTIONS: ExportOptions = {
  includeOverview: true,
  includeCostMatrix: true,
  includeArchitecture: true,
  includeSchemas: true,
  includeWireframes: true,
  includeSnippets: true,
  includePrompts: true,
};

export function generateMarkdownExport(idea: AppIdea, options: ExportOptions = DEFAULT_OPTIONS): string {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const sections: string[] = [];

  sections.push(`# ${idea.title}\n*${idea.tagline}*\n\n---`);

  if (opts.includeOverview) {
    sections.push(`## 📋 Executive Overview
- **Category:** ${idea.category}
- **Target Audience:** ${idea.targetAudience}
- **Competitive Advantage:** ${idea.competitiveEdge}
- **Monetization Model:** ${idea.monetization}
- **Exported Timestamp:** ${new Date().toISOString()}

---

## 🎯 Problem Statement
${idea.problemStatement}

---

## ✨ 5 Core MVP Features
${idea.coreFeatures.map((f, i) => `${i + 1}. **${f}**`).join('\n')}

---

## 🧭 Primary User Flow
${idea.userFlowSteps.map((step) => `- ${step}`).join('\n')}`);
  }

  if (opts.includeCostMatrix) {
    sections.push(`---

## 💰 Frugal Cost & Workload Optimization (कम खर्च में पूरा काम)
- **Frugal Monthly Run-Rate:** \`${idea.costOptimization.frugalMonthlyCostEstimate}\`
- **Avoided Enterprise Expense:** \`${idea.costOptimization.enterpriseMonthlyCostEstimate}\`
- **Cost Reduction:** **${idea.costOptimization.savingsPercentage}**
- **Estimated Dev Hours Saved:** **${idea.costOptimization.totalWorkloadHoursSaved}**

### Stack & Infrastructure Matrix
| Architectural Layer | High-Cost Enterprise Bloat | Frugal Zero-to-Low Cost Alternative | Cost Delta | How It Achieves Same Workload |
|---|---|---|---|---|
${idea.costOptimization.frugalStackRecommendation
  .map(
    (r) =>
      `| **${r.layer}** | ${r.highCostSolution} (${r.highCostEstimate}) | ${r.frugalSolution} (${r.frugalCostEstimate}) | ${r.savingsRatio} | ${r.howItDoesSameWork} |`
  )
  .join('\n')}

### Frugal Engineering Rules & Hacks
${idea.costOptimization.actionableHacks.map((h, i) => `${i + 1}. ${h}`).join('\n')}`);
  }

  if (opts.includeArchitecture) {
    let archSection = `---

## 🏛️ Comprehensive Architectural Specification
- **Architectural Pattern:** ${idea.architecturalBlueprint.pattern}
- **Offline Sync Strategy:** ${idea.architecturalBlueprint.offlineSyncStrategy}

### Presentation Layer
${idea.architecturalBlueprint.frontendLayers.map((l) => `- ${l}`).join('\n')}

### Persistence & Backend Layer
${idea.architecturalBlueprint.backendLayers.map((l) => `- ${l}`).join('\n')}`;

    if (opts.includeSchemas) {
      archSection += `\n\n### SQLite & Room Data Schemas
${idea.architecturalBlueprint.dataSchemas
  .map(
    (schema) => `
#### Table: \`${schema.tableName}\`
*${schema.description}*

| Field Name | Data Type | Key / Constraint | Description / Notes |
|---|---|---|---|
${schema.fields
  .map(
    (f) =>
      `| \`${f.name}\` | \`${f.type}\` | ${f.isPrimary ? '**Primary Key**' : 'Standard'} | ${f.notes || '-'} |`
  )
  .join('\n')}
`
  )
  .join('\n')}`;
    }

    archSection += `\n\n### API & Sync Contracts
${
  idea.architecturalBlueprint.apiEndpoints.length > 0
    ? idea.architecturalBlueprint.apiEndpoints
        .map(
          (ep) => `
- **\`${ep.method} ${ep.endpoint}\`**
  - *Description:* ${ep.description}
  - *Free-Tier Quota Impact:* ${ep.freeTierImpact}
`
        )
        .join('\n')
    : '_100% Client-side operation; zero cloud API endpoints required._'
}

### Security & Privacy Hygiene
${idea.architecturalBlueprint.securityConsiderations.map((s) => `- ✅ ${s}`).join('\n')}`;

    sections.push(archSection);
  }

  if (opts.includeWireframes && idea.wireframeBlueprint) {
    const wb = idea.wireframeBlueprint;
    let wireframeSection = `---

## 📱 Mobile UI Wireframes & Ergonomic Navigation Flows
- **Core Purpose:** ${wb.appPurpose}
- **Target Audience:** ${wb.targetAudience}
- **Design Archetype:** ${wb.archetype}

### Screen Layouts & Component Hierarchy
${wb.screens
  .map(
    (s, idx) => `
#### Screen ${idx + 1}: ${s.name} (${s.screenType})
*${s.purpose}*
- **Thumb Zone Focus:** ${s.thumbZoneFocus}

| Component | Type | Details | UX Rationale |
|---|---|---|---|
${s.elements
  .map(
    (el) =>
      `| **${el.title}** | \`${el.type}\` | ${el.subtitle || '-'} | ${el.uxRationale || '-'} |`
  )
  .join('\n')}
`
  )
  .join('\n')}

### Suggested Navigation Architecture
| Source Screen | Destination Screen | User Trigger Event | Animation / Transition | Android Backstack Handling |
|---|---|---|---|---|
${wb.navigationFlow
  .map(
    (flow) =>
      `| **${flow.fromScreen}** | **${flow.toScreen}** | ${flow.trigger} | \`${flow.transitionType}\` | ${flow.backHandling} |`
  )
  .join('\n')}

### UX Design Principles & Cognitive Rationale
${wb.uxRationales
  .map(
    (r) => `
#### 🎯 ${r.principleName}
- **Implementation:** ${r.howApplied}
- **User Experience Benefit:** ${r.benefitToUser}
`
  )
  .join('\n')}`;

    sections.push(wireframeSection);
  }

  if (opts.includeSnippets && idea.codeSnippets.length > 0) {
    sections.push(`---

## 💻 Production Codebase Snippets

${idea.codeSnippets
  .map(
    (snippet) => `
### 📄 \`${snippet.title}\` (${snippet.category})
*${snippet.description}*

\`\`\`${snippet.language || 'kotlin'}
${snippet.code}
\`\`\`
`
  )
  .join('\n')}`);
  }

  if (opts.includePrompts && idea.masterPrompts.length > 0) {
    sections.push(`---

## 🤖 Master AI Prompts Studio
${idea.masterPrompts
  .map(
    (p) => `
### Prompt Target: **${p.targetTool}** (${p.badge})
> *Tip: ${p.tips}*

\`\`\`text
${p.fullPrompt}
\`\`\`
`
  )
  .join('\n')}`);
  }

  sections.push(`\n---\n*Exported from AppForge — Mobile Idea, Frugal Stack & Architecture Architect.*`);
  return sections.join('\n\n');
}

export function generateJsonExport(idea: AppIdea, options: ExportOptions = DEFAULT_OPTIONS): string {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const filteredIdea: Partial<AppIdea> = {
    id: idea.id,
    title: idea.title,
    tagline: idea.tagline,
    category: idea.category,
    timestamp: idea.timestamp,
  };

  if (opts.includeOverview) {
    filteredIdea.targetAudience = idea.targetAudience;
    filteredIdea.problemStatement = idea.problemStatement;
    filteredIdea.coreFeatures = idea.coreFeatures;
    filteredIdea.monetization = idea.monetization;
    filteredIdea.competitiveEdge = idea.competitiveEdge;
    filteredIdea.userFlowSteps = idea.userFlowSteps;
  }

  if (opts.includeCostMatrix) {
    filteredIdea.costOptimization = idea.costOptimization;
  }

  if (opts.includeArchitecture) {
    filteredIdea.architecturalBlueprint = {
      ...idea.architecturalBlueprint,
      dataSchemas: opts.includeSchemas ? idea.architecturalBlueprint.dataSchemas : [],
    };
  }

  if (opts.includeWireframes) {
    filteredIdea.wireframeBlueprint = idea.wireframeBlueprint;
  }

  if (opts.includeSnippets) {
    filteredIdea.codeSnippets = idea.codeSnippets;
  }

  if (opts.includePrompts) {
    filteredIdea.masterPrompts = idea.masterPrompts;
  }

  const payload = {
    schemaVersion: '1.0.0',
    generator: 'AppForge Mobile Architecture Studio',
    exportedAt: new Date().toISOString(),
    project: filteredIdea,
  };

  return JSON.stringify(payload, null, 2);
}

export function exportAsMarkdown(idea: AppIdea, options?: ExportOptions) {
  const content = generateMarkdownExport(idea, options);
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const filename = `${idea.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-blueprint.md`;
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadAsJson(idea: AppIdea, options?: ExportOptions) {
  const jsonString = generateJsonExport(idea, options);
  const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const filename = `${idea.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-blueprint.json`;
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadSnippet(snippet: CodeSnippet) {
  const blob = new Blob([snippet.code], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = snippet.title;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
