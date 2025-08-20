# Linear MCP Test Komutları

## 🚀 **Test Komutları**

### **1. Issue Listeleme**
```bash
# Tüm issue'ları listele
/linear listIssues

# Belirli team'in issue'larını listele
/linear listIssues --teamId "team-id"

# Belirli state'deki issue'ları listele
/linear listIssues --state "Open"
```

### **2. Issue Oluşturma**
```bash
# Basit issue oluştur
/linear createIssue --title "Test Issue" --description "Bu bir test issue'sudur"

# Detaylı issue oluştur
/linear createIssue \
  --title "RFC-0001 Task 1.1.1: Search Orchestrator Interface" \
  --description "Search orchestrator'ın temel interface'ini oluştur" \
  --priority "High" \
  --estimate 1 \
  --teamId "team-id"
```

### **3. Issue Güncelleme**
```bash
# Issue state'ini güncelle
/linear updateIssue --id "issue-id" --state "In Progress"

# Issue description'ını güncelle
/linear updateIssue --id "issue-id" --description "Güncellenmiş açıklama"
```

### **4. Project Management**
```bash
# Project listele
/linear listProjects

# Project oluştur
/linear createProject --name "RFC-0001 Implementation" --description "Multi-Module Search System"

# Team listele
/linear listTeams

# Cycle oluştur
/linear createCycle --name "Sprint 1.1" --startDate "2024-01-01" --endDate "2024-01-14"
```

## 📋 **Travel-UI RFC Task'larını Linear'a Aktarma**

### **RFC-0001 Task'ları**
```bash
# Task 1.1.1: Search Orchestrator Interface
/linear createIssue \
  --title "Task 1.1.1: Search Orchestrator Interface" \
  --description "## Acceptance Criteria:
- [ ] SearchOrchestrator interface'i tanımlanmış
- [ ] executeSearch, dispatchToModules, aggregateResults metodları mevcut
- [ ] TypeScript type definitions tamamlanmış
- [ ] Unit test coverage %90+

## Estimated Time: 1 day
## Assignee: Backend Developer" \
  --priority "High" \
  --estimate 1

# Task 1.1.2: Query Parser Implementation
/linear createIssue \
  --title "Task 1.1.2: Query Parser Implementation" \
  --description "## Acceptance Criteria:
- [ ] UnifiedSearchQuery validation çalışıyor
- [ ] Location, date, passenger parsing doğru
- [ ] Module type validation aktif
- [ ] Error handling implement edilmiş
- [ ] Unit testler geçiyor

## Estimated Time: 2 days
## Assignee: Backend Developer" \
  --priority "High" \
  --estimate 2
```

### **RFC-0002 Task'ları**
```bash
# Task 1.1.1: Payment Orchestrator Interface
/linear createIssue \
  --title "Task 1.1.1: Payment Orchestrator Interface" \
  --description "## Acceptance Criteria:
- [ ] PaymentOrchestrator interface'i tanımlanmış
- [ ] processPayment, selectProvider, assessRisk metodları mevcut
- [ ] TypeScript type definitions tamamlanmış
- [ ] Unit test coverage %90+

## Estimated Time: 1 day
## Assignee: Backend Developer" \
  --priority "High" \
  --estimate 1
```

## 🔄 **GitHub Integration**

### **PR Template**
```markdown
## Related Linear Issue
Closes #TASK-123

## Changes Made
- [ ] Feature implementation
- [ ] Tests added
- [ ] Documentation updated

## Acceptance Criteria
- [ ] All acceptance criteria met
- [ ] Unit tests passing
- [ ] Integration tests passing
```

## 📊 **Progress Tracking**

### **Sprint Progress**
```bash
# Sprint progress'i kontrol et
/linear listIssues --cycleId "cycle-id"

# Team velocity hesapla
/linear listIssues --teamId "team-id" --state "Done" --completedAfter "2024-01-01"
```

## 🎯 **Test Checklist**

- [ ] `/linear listIssues` çalışıyor
- [ ] `/linear createIssue` çalışıyor
- [ ] `/linear updateIssue` çalışıyor
- [ ] `/linear listTeams` çalışıyor
- [ ] `/linear listProjects` çalışıyor
- [ ] RFC task'ları Linear'a aktarıldı
- [ ] GitHub integration çalışıyor
