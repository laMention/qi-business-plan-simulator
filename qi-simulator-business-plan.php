<?php

/**
 * Plugin Name: QI Business Plan Simulator
 * Plugin URI: https://github.com/laMention/qi-business-plan-simulator
 * Description: Simulateur de business plan financier intégrable via shortcode. Utilisation: [qi_simulator]
 * Version: 2.0
 * Author: Dagou Patrick Elysée Botchi
 * Author URI: https://www.linkedin.com/in/dagou-patrick-elys%C3%A9e-botchi-48a94b96/
*/

if (!defined('ABSPATH')) exit; // Sécurité

// Enregistrement des assets (JS + CSS)
function qi_simulator_enqueue_assets() {
    // Style inline (vu que c'est un style custom et unique au composant)
    wp_register_style('qi-simulator-style', false);
    wp_enqueue_style('qi-simulator-style');


    $css_path = plugin_dir_path(__FILE__) . 'style.css';
    if (file_exists($css_path)) {
        wp_add_inline_style('qi-simulator-style', file_get_contents($css_path));
    }

    // wp_add_inline_style('qi-simulator-style', file_get_contents(plugin_dir_path(__FILE__) . 'style.css'));
    wp_enqueue_script('qi-simulator-script', plugin_dir_url(__FILE__) . 'script.js', [], null, true);
}
add_action('wp_enqueue_scripts', 'qi_simulator_enqueue_assets');

// Shortcode
function qi_simulator_shortcode() {
	ob_start();

?>

	<div class="container">
	    <h1 class="qi-title">Simulateur QI – Business Plan</h1>
	    <p class="small">Remplissez les données, choisissez l'évaluation puis cliquez sur <strong>Calculer</strong>. Vous pouvez imprimer ou télécharger le rapport en PDF.</p>

	    <div class="grid">
	      <div class="card">
	        <h2>Entrées générales</h2>
	        <div class="row">
	          <div class="col">
	            <label>Coût total du projet <span class="mandatory">*Obligatoire</span></label>
	            <input type="number" id="cost" value="60" min="0" step="0.01" onchange="calculateDebt()" oninput="calculateDebt()">
	          </div>
	          <div class="col">
	            <label>Apport propre <span class="mandatory">*Obligatoire</span></label>
	            <input type="number" id="equityInput" value="10" min="0" step="0.01" onchange="calculateDebt()" oninput="calculateDebt()">
	          </div>
	        </div>

	        <div class="row">
	          <div class="col">
	            <label>Dette (montant)</label>
	            <input type="number" id="debt" value="50" min="0" step="0.01" readonly>
	          </div>
	          <div class="col">
	            <label>Année de remboursement (nombre d'années) <span class="mandatory">*Obligatoire</span></label>
	            <input type="number" id="years" value="5" min="1" step="1">
	          </div>
	        </div>

	        <div style="margin-bottom:12px">
	          <label>Taux d'intérêt sur la dette (ex. 0.1 pour 10%) <span class="mandatory">*Obligatoire</span></label>
	          <input type="number" id="interestRate" value="0.1" min="0" step="0.0001" >
	        </div>

	        <div style="margin-bottom:12px">
	          <label>Type de régime fiscal <span class="mandatory">*Obligatoire</span></label>
	          <select id="taxRegime" onchange="setTaxRate()">
	            <option value="TEE">TEE (Taxe d'Etat de l'entreprenant) – 5%</option>
	            <option value="RME">RME (Impôt micro-entreprise) – 6%</option>
	            <option value="RSI">RSI (Régime réel simplifié) – 25%</option>
	            <option value="RNI">RNI (Régime réel normal) – 25%</option>
	          </select>
	        </div>

	        <div style="margin-bottom:12px">
	          <label>Impôt dû (%)</label>
	          <input type="number" id="taxRate" value="5" min="0" step="0.0001" readonly disabled>
	        </div>

	        <hr style="margin:16px 0;border:none;border-top:1px solid var(--border)">
	        
	        <h3>Données par période (1, 2, 3)</h3>

	        <label>Chiffre d'Affaires (Revenus) <span class="mandatory">*Obligatoire</span></label>
	        <div class="periods-header">
	          <div class="small">P1</div><div class="small">P2</div><div class="small">P3</div>
	        </div>
	        <div class="periods-grid">
	          <input type="number" id="revenue0" placeholder="Revenus P1" value="30" step="0.01">
	          <input type="number" id="revenue1" placeholder="Revenus P2" value="40" step="0.01">
	          <input type="number" id="revenue2" placeholder="Revenus P3" value="55" step="0.01">
	        </div>

	        <label>Dépenses générales <span class="mandatory">*Obligatoire</span></label>
	        <div class="periods-header">
	          <div class="small">P1</div><div class="small">P2</div><div class="small">P3</div>
	        </div>
	        <div class="periods-grid">
	          <input type="number" id="opex0" placeholder="Dépenses P1" value="15" step="0.01">
	          <input type="number" id="opex1" placeholder="Dépenses P2" value="18" step="0.01">
	          <input type="number" id="opex2" placeholder="Dépenses P3" value="22" step="0.01">
	        </div>

	        <label>Dépenses immobilisations ou équipement / matériel <span class="mandatory">*Obligatoire</span></label>
	        <div class="periods-header">
	          <div class="small">P1</div><div class="small">P2</div><div class="small">P3</div>
	        </div>
	        <div class="periods-grid">
	          <input type="number" id="capex0" placeholder="Capex P1" value="5" step="0.01">
	          <input type="number" id="capex1" placeholder="Capex P2" value="3" step="0.01">
	          <input type="number" id="capex2" placeholder="Capex P3" value="2" step="0.01">
	        </div>

	        <label>Dividendes <span class="mandatory">*Obligatoire</span></label>
	        <div class="periods-header">
	          <div class="small">P1</div><div class="small">P2</div><div class="small">P3</div>
	        </div>
	        <div class="periods-grid">
	          <input type="number" id="div0" placeholder="Dividendes P1" value="0" step="0.01">
	          <input type="number" id="div1" placeholder="Dividendes P2" value="2" step="0.01">
	          <input type="number" id="div2" placeholder="Dividendes P3" value="4" step="0.01">
	        </div>

	        <label>Autre Dépenses <span class="mandatory">*Obligatoire</span></label>
	        <div class="periods-header">
	          <div class="small">P1</div><div class="small">P2</div><div class="small">P3</div>
	        </div>
	        <div class="periods-grid">
	          <input type="number" id="depr0" placeholder="Dépréciation P1" value="2" step="0.01">
	          <input type="number" id="depr1" placeholder="Dépréciation P2" value="2" step="0.01">
	          <input type="number" id="depr2" placeholder="Dépréciation P3" value="2" step="0.01">
	        </div>

	        <div class="calc-section" style="margin-top:16px">
	          <div style="flex:1">
	            <label>Évaluation souhaitée (Choisir l'évaluation à calculer) <span class="mandatory">*Obligatoire</span></label>
	            <select id="evaluationType">
	              <option value="current">Évaluation de la santé actuelle</option>
	              <option value="future">Évaluation de la santé future</option>
	            </select>
	          </div>
	          <button id="calcBtn">Calculer</button>
	        </div>

	        <div id="message" class="small muted" style="margin-top:8px"></div>
	      </div>

	      <div class="card">
	        <h2>Résultats</h2>
	        <div class="controls">
	          <button id="printBtn">Imprimer</button>
	          <button id="downloadPdfBtn">Télécharger PDF</button>
	        </div>
	        <div id="resultsArea">
	          <p class="small muted">Cliquez sur <strong>Calculer</strong> pour afficher les résultats.</p>
	        </div>
	      </div>
	    </div>

	    <div class="bottom-grid">
	      <div class="card" id="matrixCard">
	        <h3>Matrice d'évaluation</h3>
	        <div class="table-container">
	          <div id="matrixArea" class="small muted">(sera rempli après calcul)</div>
	        </div>
	      </div>

	      <div class="card">
	        <h3>Interprétation</h3>
	        <div id="interpretation">(sera rempli après calcul)</div>
	      </div>
	    </div>

	    <p class="small" style="margin-top:14px;color:var(--muted)">Notes: l'impôt est appliqué au résultat d'exploitation selon le régime choisi. Le simulateur utilise un remboursement linéaire du capital (annuité constante de principal = dette / années) et calcule les intérêts sur le solde restant.</p>
	</div>

	<!-- jsPDF & html2canvas pour télécharger en PDF côté client -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>

<?php
	return ob_get_clean();
}

add_shortcode('qi_simulator', 'qi_simulator_shortcode');

