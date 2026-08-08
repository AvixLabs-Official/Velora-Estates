/**
 * VELORA ESTATES - Interactive Mortgage & Financing Calculator
 * Standard Fixed-Rate Amortization Formula with Indian Currency Format
 */

document.addEventListener('DOMContentLoaded', () => {
  initMortgageCalculator();
});

function initMortgageCalculator() {
  const priceInput = document.getElementById('calc-price');
  const downInput = document.getElementById('calc-down');
  const rateInput = document.getElementById('calc-rate');
  const termInput = document.getElementById('calc-term');

  const priceVal = document.getElementById('calc-price-val');
  const downVal = document.getElementById('calc-down-val');
  const rateVal = document.getElementById('calc-rate-val');
  const termVal = document.getElementById('calc-term-val');

  if (!priceInput || !downInput || !rateInput || !termInput) return;

  function calculate() {
    const price = parseFloat(priceInput.value);
    const downPct = parseFloat(downInput.value);
    const annualRate = parseFloat(rateInput.value);
    const termYears = parseInt(termInput.value, 10);

    const downAmount = price * (downPct / 100);
    const loanAmount = price - downAmount;

    const monthlyRate = (annualRate / 100) / 12;
    const totalMonths = termYears * 12;

    let emi = 0;
    if (monthlyRate > 0) {
      emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
    } else {
      emi = loanAmount / totalMonths;
    }

    const totalPayment = emi * totalMonths;
    const totalInterest = totalPayment - loanAmount;

    // Display formatted values
    if (priceVal) priceVal.textContent = formatINR(price);
    if (downVal) downVal.textContent = `${downPct}% (${formatINR(downAmount)})`;
    if (rateVal) rateVal.textContent = `${annualRate.toFixed(1)}%`;
    if (termVal) termVal.textContent = `${termYears} Years`;

    const loanAmountEl = document.getElementById('res-loan-amount');
    const monthlyEmiEl = document.getElementById('res-monthly-emi');
    const totalInterestEl = document.getElementById('res-total-interest');
    const totalPaymentEl = document.getElementById('res-total-payment');

    if (loanAmountEl) loanAmountEl.textContent = formatINR(loanAmount);
    if (monthlyEmiEl) monthlyEmiEl.textContent = formatINR(Math.round(emi));
    if (totalInterestEl) totalInterestEl.textContent = formatINR(Math.round(totalInterest));
    if (totalPaymentEl) totalPaymentEl.textContent = formatINR(Math.round(totalPayment));
  }

  [priceInput, downInput, rateInput, termInput].forEach(inp => {
    inp.addEventListener('input', calculate);
  });

  // Initial Calculation
  calculate();
}

function formatINR(amount) {
  if (isNaN(amount)) return "₹0";

  if (amount >= 10000000) {
    const cr = (amount / 10000000).toFixed(2);
    return `₹${cr} Cr`;
  } else if (amount >= 100000) {
    const lakh = (amount / 100000).toFixed(2);
    return `₹${lakh} Lakh`;
  }

  return '₹' + Math.round(amount).toLocaleString('en-IN');
}
