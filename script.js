// Mapping des taux d'imposition
const TAX_RATES = {TEE:0.05, RME:0.06, RSI:0.25, RNI:0.25};

// === Option A : Scoring choisi raisonnablement ===
// Points par catégorie (chaque métrique sur 20 points) :
const SCORING = {
  // Marge nette: Excellent 20, Très bon 17, Bon 12, Tolérable 8, Faible 4
  netMargin: [ {label:'Excellent', min:0.8, pts:20}, {label:'Très bon', min:0.7, pts:17}, {label:'Bon', min:0.5, pts:12}, {label:'Tolérable', min:0.0, pts:8}, {label:'Faible', min:-999, pts:4} ],
  // Couverture dette: sain >=1.25 =>20,  <1.25 =>8
  coverage: [ {label:'Sain', min:1.25, pts:20}, {label:'Faible', min:0, pts:8} ],
  // Levier des flux: lower is better. thresholds in coefficient (debt / ocf): <=2 =>20, <=5 =>16, <=10 =>12, >10 =>8
  leverage: [ {label:'Très bon', max:2, pts:20}, {label:'Bon', max:5, pts:16}, {label:'Limite', max:10, pts:12}, {label:'Endettement élevé', max:9999, pts:8} ],
  // Total dépenses / revenus: lower is better. <=40% =>20, <=60% =>16, <=80% =>12, >80% =>8
  expensesRatio: [ {label:'Sain', max:0.4, pts:20}, {label:'Acceptable', max:0.6, pts:16}, {label:'Préoccupant', max:0.8, pts:12}, {label:'Besoin de financement', max:9999, pts:8} ],
  // Croissance dette: reduction excellent <= -50% =>20, -50..-20 =>16, -20..0 =>12, 0 =>10, >0 =>4
  debtGrowth: [ {label:'Excellente réduction', max:-0.5, pts:20, cmp:'le'}, {label:'Réduction significative', min:-0.5, max:-0.2, pts:16}, {label:'Réduction modérée', min:-0.2, max:0, pts:12}, {label:'Stabilité', min:0, max:0, pts:10}, {label:'Augmentation', min:0.0000001, max:9999, pts:4} ]
}


function calculateDebt() {
    // Récupérer les valeurs des champs
    const cost = parseFloat(document.getElementById('cost').value) || 0;
    const equity = parseFloat(document.getElementById('equityInput').value) || 0;
    
    // Calculer la dette
    const debt = Math.max(0, cost - equity); // S'assurer que la dette n'est pas négative
    
    // Mettre à jour le champ dette
    document.getElementById('debt').value = debt
    
}

function setTaxRate(){
  const taxRegime = document.getElementById('taxRegime').value
  let taxRateValue 

  switch(taxRegime){
    case 'TEE':
      taxRateValue = 5
      break;
    case 'RME':
      taxRateValue = 6

      break;
    case 'RSI':
      taxRateValue = 25

      break;
    case 'RNI':
      taxRateValue = 25

      break;
    default:
      taxRateValue = 5
      break;

  }
  document.getElementById('taxRate').value = taxRateValue
}


function number(v){return Number(v)||0}

function compute(){
  const cost = number(document.getElementById('cost').value)
  const equityInput = number(document.getElementById('equityInput').value)
  let debt = number(document.getElementById('debt').value)
  const years = Math.max(1, Math.floor(number(document.getElementById('years').value)))
  const interestRate = number(document.getElementById('interestRate').value)
  const regime = document.getElementById('taxRegime').value
  const taxRate = TAX_RATES[regime] ?? 0
  const evalType = document.getElementById('evaluationType').value

  // Périodes
  const revenues = [number(document.getElementById('revenue0').value), number(document.getElementById('revenue1').value), number(document.getElementById('revenue2').value)]
  const opex = [number(document.getElementById('opex0').value), number(document.getElementById('opex1').value), number(document.getElementById('opex2').value)]
  const capex = [number(document.getElementById('capex0').value), number(document.getElementById('capex1').value), number(document.getElementById('capex2').value)]
  const dividends = [number(document.getElementById('div0').value), number(document.getElementById('div1').value), number(document.getElementById('div2').value)]
  const depr = [number(document.getElementById('depr0').value), number(document.getElementById('depr1').value), number(document.getElementById('depr2').value)]

  // Calcul annuité de principal linéaire
  const annualPrincipal = debt / years
  let remainingDebt = debt

  // Résultats par période
  const periods = [0,1,2].map(i=>{return {period:i+1}})

  periods.forEach((p,i)=>{
    p.revenue = revenues[i]
    p.opex = opex[i]
    p.capex = capex[i]
    p.dividends = dividends[i]
    p.depr = depr[i]

    // Résultat d'exploitation
    p.operatingResult = p.revenue - p.opex
    // Impôt dépend du régime
    p.tax = p.operatingResult > 0 ? p.operatingResult * taxRate : 0
    // Résultat net
    p.netResult = p.operatingResult - p.tax
    // Flux de trésorerie d'exploitation = résultat net + dépréciation
    p.operatingCashFlow = p.netResult + p.depr

    // Service de la dette (principal + interest)
    // principal payé cette période: si still remaining
    p.principal = Math.min(remainingDebt, annualPrincipal)
    p.interest = remainingDebt * interestRate
    // reduce remaining debt for next period
    remainingDebt = Math.max(0, remainingDebt - p.principal)

    // Cash flow net
    p.cashFlowNet = p.operatingCashFlow - (p.principal + p.interest + p.depr + p.dividends)

    // Levier = total dette à long terme / flux d'exploitation (avoid div by zero)
    p.leverage = p.operatingCashFlow !== 0 ? (debt / p.operatingCashFlow) : null
  })

  // Matrice metrics
  const metrics = periods.map(p=>{
    // marge nette de flux de tresorerie
    const netMargin = p.revenue !== 0 ? (p.operatingCashFlow / p.revenue) : 0
    // ratio couverture dette
    const debtService = p.principal + p.interest
    const coverage = debtService !== 0 ? (p.operatingCashFlow / debtService) : 0
    // levier flux
    const leverage = p.operatingCashFlow !== 0 ? (debt / p.operatingCashFlow) : null
    // total dépenses / revenues
    const totalExpensesRatio = p.revenue !==0 ? ((p.opex + p.capex) / p.revenue) : 0
    return {
      netMargin, coverage, leverage, totalExpensesRatio
    }
  })

  // Helper: scoring functions using SCORING tables
  function scoreNetMargin(m){
    // m is ratio like 0.6
    if(m >= SCORING.netMargin[0].min) return SCORING.netMargin[0].pts // Excellent
    if(m >= SCORING.netMargin[1].min) return SCORING.netMargin[1].pts // Très bon
    if(m >= SCORING.netMargin[2].min) return SCORING.netMargin[2].pts // Bon
    if(m >= SCORING.netMargin[3].min) return SCORING.netMargin[3].pts // Tolérable
    return SCORING.netMargin[4].pts
  }
  function scoreCoverage(c){
    return c >= SCORING.coverage[0].min ? SCORING.coverage[0].pts : SCORING.coverage[1].pts
  }
  function scoreLeverage(l){
    if(l === null) return 8
    if(l <= SCORING.leverage[0].max) return SCORING.leverage[0].pts
    if(l <= SCORING.leverage[1].max) return SCORING.leverage[1].pts
    if(l <= SCORING.leverage[2].max) return SCORING.leverage[2].pts
    return SCORING.leverage[3].pts
  }
  function scoreExpensesRatio(r){
    if(r <= SCORING.expensesRatio[0].max) return SCORING.expensesRatio[0].pts
    if(r <= SCORING.expensesRatio[1].max) return SCORING.expensesRatio[1].pts
    if(r <= SCORING.expensesRatio[2].max) return SCORING.expensesRatio[2].pts
    return SCORING.expensesRatio[3].pts
  }
  function scoreDebtGrowth(g){
    if(g <= SCORING.debtGrowth[0].max) return SCORING.debtGrowth[0].pts
    if(g > SCORING.debtGrowth[1].min && g <= SCORING.debtGrowth[1].max) return SCORING.debtGrowth[1].pts
    if(g > SCORING.debtGrowth[2].min && g <= SCORING.debtGrowth[2].max) return SCORING.debtGrowth[2].pts
    if(g === 0) return SCORING.debtGrowth[3].pts
    return SCORING.debtGrowth[4].pts
  }

  // Compute averaged metrics (pondéré simple moyenne)
  function avg(arr, key){
    return arr.reduce((s,x)=>s + (x[key]||0), 0)/arr.length
  }
  const avgNetMargin = avg(metrics, 'netMargin')
  const avgCoverage = avg(metrics, 'coverage')
  const avgLeverage = avg(metrics, 'leverage')
  const avgExpenses = avg(metrics, 'totalExpensesRatio')

  // Points per metric (using averages where relevant)
  const ptsNetMargin = scoreNetMargin(avgNetMargin)
  const ptsCoverage = scoreCoverage(avgCoverage)
  const ptsLeverage = scoreLeverage(avgLeverage)
  const ptsExpenses = scoreExpensesRatio(avgExpenses)

  // Debt growth over the whole horizon: compare debt end vs start
  const debtStart = debt
  const principalPaidTotal = periods.reduce((s,p)=>s + p.principal,0)
  const debtEnd = Math.max(0, debtStart - principalPaidTotal)
  const debtGrowth = debtStart !==0 ? ((debtEnd - debtStart)/debtStart) : 0
  const ptsDebtGrowth = scoreDebtGrowth(debtGrowth)

  const totalQI = ptsNetMargin + ptsCoverage + ptsLeverage + ptsExpenses + ptsDebtGrowth // max 100

  // Interpretation based on averaged net margin
  const avgNetMarginPct = avgNetMargin*100
  let interpretation = ''
  if(avgNetMarginPct < 50) interpretation = 'Tolérable'
  else if(avgNetMarginPct >=50 && avgNetMarginPct <70) interpretation = 'Bon'
  else if(avgNetMarginPct >=70 && avgNetMarginPct <80) interpretation = 'Très bon'
  else interpretation = 'Excellent'

  // Prepare HTML output
  const resultsArea = document.getElementById('resultsArea')
  resultsArea.innerHTML = ''

  // Detailed results table
  const tableContainer = document.createElement('div')
  tableContainer.className = 'table-container'
  
  const table = document.createElement('table')
  const thead = document.createElement('thead')
  thead.innerHTML = '<tr><th>Indicateur</th><th>P1</th><th>P2</th><th>P3</th></tr>'
  table.appendChild(thead)
  const tbody = document.createElement('tbody')
  function addRow(name, accessor, fmt){
    const tr = document.createElement('tr')
    tr.innerHTML = `<td>${name}</td>` + periods.map(p=>`<td>${fmt(accessor(p))}</td>`).join('')
    tbody.appendChild(tr)
  }
  const fmt = v=> (v===null?'-':(typeof v==='number' ? Number(v).toLocaleString(undefined,{maximumFractionDigits:2}) : v))

  addRow('Revenus', p=>p.revenue, fmt)
  addRow('Dépenses générales', p=>p.opex, fmt)
  addRow('Capex', p=>p.capex, fmt)
  addRow('Résultat d\'exploitation', p=>p.operatingResult, fmt)
  addRow('Impôt', p=>p.tax, fmt)
  addRow('Résultat net', p=>p.netResult, fmt)
  addRow('Dépréciation', p=>p.depr, fmt)
  addRow('Flux de trésorerie d\'exploitation', p=>p.operatingCashFlow, fmt)
  addRow('Principal (service dette)', p=>p.principal, fmt)
  addRow('Intérêts (service dette)', p=>p.interest, fmt)
  addRow('Dividendes', p=>p.dividends, fmt)
  addRow('Cash flow net', p=>p.cashFlowNet, fmt)

  table.appendChild(tbody)
  tableContainer.appendChild(table)
  resultsArea.appendChild(tableContainer)

  // Matrix summary
  const matrixArea = document.getElementById('matrixArea')
  matrixArea.innerHTML = ''
  
  const matrixContainer = document.createElement('div')
  matrixContainer.className = 'table-container'
  
  const mtable = document.createElement('table')
  mtable.innerHTML = '<thead><tr><th>Metric</th><th>P1</th><th>P2</th><th>P3</th><th>Résult. pondéré</th><th>Points</th></tr></thead>'
  const mb = document.createElement('tbody')
  function mRow(label, getVal, pts){
    const vals = periods.map((p,i)=> {
      const v = getVal(metrics[i])
      return (typeof v==='number') ? (v*100).toFixed(1)+'%' : '-'
    })
    const weighted = (getVal({netMargin:avgNetMargin,coverage:avgCoverage,leverage:avgLeverage,totalExpensesRatio:avgExpenses})*100).toFixed(1) + '%'
    const tr = document.createElement('tr')
    tr.innerHTML = `<td>${label}</td>` + vals.map(v=>`<td>${v}</td>`).join('') + `<td>${weighted}</td><td>${pts}</td>`
    mb.appendChild(tr)
  }

  mRow('Marge nette flux de trésorerie', m=>m.netMargin, ptsNetMargin)
  mRow('Ratio couverture service dette', m=>m.coverage, ptsCoverage)
  mRow('Ratio levier des flux', m=> (m.leverage===null?null:m.leverage), ptsLeverage)
  mRow('Total dépenses / Total revenus', m=>m.totalExpensesRatio, ptsExpenses)

  // add debt growth row
  const debtVals = periods.map((p,i)=>'-')
  const debtWeighted = ((debtGrowth)*100).toFixed(1) + '%'
  const debtRow = document.createElement('tr')
  debtRow.innerHTML = `<td>Croissance totale de la dette</td>` + debtVals.map(v=>`<td>${v}</td>`).join('') + `<td>${debtWeighted}</td><td>${ptsDebtGrowth}</td>`
  mb.appendChild(debtRow)

  mtable.appendChild(mb)
  matrixContainer.appendChild(mtable)
  matrixArea.appendChild(matrixContainer)

  // Interpretation card
  const interp = document.getElementById('interpretation')
  interp.innerHTML = `<div class="result-highlight"><strong>Interprétation générale:</strong> <span style="font-weight:700">${interpretation}</span><br><small class="muted">(Basée sur la marge nette moyenne de flux de trésorerie = ${avgNetMarginPct.toFixed(1)}%)</small><br><br><strong>Total QI (sur 100):</strong> <span style="font-weight:700">${totalQI}</span></div>`

  // Message
  document.getElementById('message').textContent = `Régime: ${regime} – Taux d'imposition: ${ (taxRate*100).toFixed(2)}%`;
}

// Print and PDF functions
function printReport(){
  window.print()
}

async function downloadPDF(){
  const { jsPDF } = window.jspdf
  const container = document.querySelector('.container')
  // use html2canvas to snapshot
  const canvas = await html2canvas(container, {scale:2})
  const imgData = canvas.toDataURL('image/png')
  const pdf = new jsPDF({orientation:'portrait', unit:'pt', format:'a4'})
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  // calculate dimensions
  const imgProps = { width: canvas.width, height: canvas.height }
  const ratio = Math.min(pageWidth / imgProps.width, pageHeight / imgProps.height)
  const imgWidth = imgProps.width * ratio
  const imgHeight = imgProps.height * ratio
  pdf.addImage(imgData, 'PNG', (pageWidth - imgWidth)/2, 20, imgWidth, imgHeight)
  pdf.save('QI_BusinessPlan_Report.pdf')
}

// Event listeners
document.getElementById('calcBtn').addEventListener('click', compute)
document.getElementById('printBtn').addEventListener('click', printReport)
document.getElementById('downloadPdfBtn').addEventListener('click', downloadPDF)

// Calculer la dette au chargement de la page
calculateDebt();

// Recuperer l'impot dû en fonction du régime
setTaxRate();

// Ajouter des événements pour calculer en temps réel
document.getElementById('cost').addEventListener('input', calculateDebt);
document.getElementById('equityInput').addEventListener('input', calculateDebt);

document.getElementById('taxRegime').addEventListener('change',setTaxRate)