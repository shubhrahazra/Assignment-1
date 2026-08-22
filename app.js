/**
 * NovaPost — Modern Public REST API POST Client & Data Manager
 * Pure Vanilla JavaScript (ES6+)
 */

// ============================================================================
// 1. Configuration & State Management
// ============================================================================

const API_CONFIG = {
  dummyjson: {
    name: 'DummyJSON Products API',
    url: 'https://dummyjson.com/products/add',
    method: 'POST',
    fields: {
      titleLabel: 'Product Name',
      titlePlaceholder: 'e.g. Wireless Noise-Cancelling Headphones',
      categoryLabel: 'Product Category',
      valueLabel: 'Price ($ USD)',
      valuePlaceholder: 'e.g. 199.99',
      valueIcon: 'fa-tag',
      brandLabel: 'Brand / Manufacturer',
      brandPlaceholder: 'e.g. Sony Audio',
      ratingLabel: 'Stock Quantity',
      ratingPlaceholder: 'e.g. 45',
      descLabel: 'Product Overview & Specs'
    },
    sampleData: [
      {
        title: 'Sony WH-1000XM5 Wireless Headphones',
        category: 'audio',
        value: 399.99,
        brand: 'Sony Electronics',
        rating: 65,
        description: 'Industry-leading noise cancellation with two processors and 8 microphones for exceptional sound quality and crystal-clear hands-free calling.'
      },
      {
        title: 'Logitech MX Master 3S Ergonomic Mouse',
        category: 'productivity',
        value: 99.99,
        brand: 'Logitech',
        rating: 120,
        description: 'Quiet click electromagnetic scrolling mouse with 8K DPI sensor that tracks on any surface including glass.'
      },
      {
        title: 'MacBook Pro 16" M3 Max',
        category: 'electronics',
        value: 3499.00,
        brand: 'Apple',
        rating: 25,
        description: 'Unprecedented performance for demanding workflows featuring a 16-core CPU, 40-core GPU, and Liquid Retina XDR display.'
      },
      {
        title: 'Nordic Minimalist Smart Desk Lamp',
        category: 'home',
        value: 79.50,
        brand: 'Lumina Studio',
        rating: 80,
        description: 'Dimmable LED ambient lighting with wireless fast-charging base, touch controls, and circadian rhythm scheduling.'
      }
    ],
    formatPayload: (form) => ({
      title: form.title.trim(),
      description: form.description.trim(),
      price: parseFloat(form.value) || 0,
      category: form.category,
      brand: form.brand ? form.brand.trim() : 'Generic',
      stock: parseInt(form.rating, 10) || 10
    }),
    normalizeResponse: (res, inputData, latency, statusCode) => ({
      id: res.id || Math.floor(Math.random() * 900) + 100,
      timestamp: new Date().toISOString(),
      apiSource: 'DummyJSON',
      title: res.title || inputData.title,
      category: res.category || inputData.category,
      price: res.price !== undefined ? res.price : inputData.value,
      brand: res.brand || inputData.brand || 'N/A',
      rating: res.stock !== undefined ? res.stock : inputData.rating || 0,
      description: res.description || inputData.description,
      statusCode: statusCode || 201,
      latency: latency,
      rawResponse: res
    })
  },

  jsonplaceholder: {
    name: 'JSONPlaceholder Posts API',
    url: 'https://jsonplaceholder.typicode.com/posts',
    method: 'POST',
    fields: {
      titleLabel: 'Post Title / Headline',
      titlePlaceholder: 'e.g. Building Scalable Web Apps with Modern APIs',
      categoryLabel: 'Topic / Department',
      valueLabel: 'Author ID (1-100)',
      valuePlaceholder: 'e.g. 1',
      valueIcon: 'fa-user',
      brandLabel: 'Author Name / Tag',
      brandPlaceholder: 'e.g. John Doe',
      ratingLabel: 'Read Time (Minutes)',
      ratingPlaceholder: 'e.g. 5',
      descLabel: 'Article Content / Body'
    },
    sampleData: [
      {
        title: 'Mastering Asynchronous JavaScript with Async/Await',
        category: 'productivity',
        value: 1,
        brand: 'Tech Insights',
        rating: 6,
        description: 'A deep dive into asynchronous programming in modern JavaScript, exploring promises, fetch API architecture, and microtask queues.'
      },
      {
        title: 'Next-Gen Frontend Architectures in 2026',
        category: 'electronics',
        value: 4,
        brand: 'Dev Weekly',
        rating: 8,
        description: 'Exploring modern rendering strategies, hydration boundaries, micro-frontends, and performance optimization techniques.'
      }
    ],
    formatPayload: (form) => ({
      title: form.title.trim(),
      body: form.description.trim(),
      userId: parseInt(form.value, 10) || 1
    }),
    normalizeResponse: (res, inputData, latency, statusCode) => ({
      id: res.id || 101,
      timestamp: new Date().toISOString(),
      apiSource: 'JSONPlaceholder',
      title: res.title || inputData.title,
      category: inputData.category || 'productivity',
      price: `$${inputData.value || '0.00'}`,
      brand: inputData.brand || 'JSONPlaceholder Author',
      rating: inputData.rating || 1,
      description: res.body || inputData.description,
      statusCode: statusCode || 201,
      latency: latency,
      rawResponse: res
    })
  },

  dummyjson_posts: {
    name: 'DummyJSON Articles API',
    url: 'https://dummyjson.com/posts/add',
    method: 'POST',
    fields: {
      titleLabel: 'Article Headline',
      titlePlaceholder: 'e.g. Architecting Scalable Frontend Applications',
      categoryLabel: 'Domain / Category',
      valueLabel: 'Author / User ID (1-50)',
      valuePlaceholder: 'e.g. 5',
      valueIcon: 'fa-user-pen',
      brandLabel: 'Primary Tag / Topic',
      brandPlaceholder: 'e.g. WebArchitecture',
      ratingLabel: 'Claps / Reactions Target',
      ratingPlaceholder: 'e.g. 150',
      descLabel: 'Article Abstract & Body'
    },
    sampleData: [
      {
        title: 'Architecting Scalable Frontend Applications with Vanilla JS',
        category: 'productivity',
        value: 5,
        brand: 'FrontendEngine',
        rating: 240,
        description: 'A comprehensive study on building modular, dependency-free web applications utilizing modern ES6+ features, native Web APIs, and CSS custom properties.'
      },
      {
        title: 'Understanding Asynchronous HTTP Pipelines & Microtasks',
        category: 'electronics',
        value: 12,
        brand: 'JavaScriptDeepDive',
        rating: 180,
        description: 'How the browser event loop processes Fetch API promises, network queues, and DOM rendering updates.'
      }
    ],
    formatPayload: (form) => ({
      title: form.title.trim(),
      body: form.description.trim(),
      userId: parseInt(form.value, 10) || 5
    }),
    normalizeResponse: (res, inputData, latency, statusCode) => ({
      id: res.id || 251,
      timestamp: new Date().toISOString(),
      apiSource: 'DummyJSON (Posts)',
      title: res.title || inputData.title,
      category: inputData.category || 'productivity',
      price: `$${inputData.value || 0}`,
      brand: inputData.brand || 'Engineering Lead',
      rating: inputData.rating || 100,
      description: res.body || inputData.description,
      statusCode: statusCode || 201,
      latency: latency,
      rawResponse: res
    })
  }
};

// Initial state
const AppState = {
  currentApi: 'dummyjson',
  submissions: [],
  metrics: {
    totalRequests: 0,
    successfulRequests: 0,
    totalLatencyMs: 0
  },
  table: {
    searchQuery: '',
    categoryFilter: 'ALL',
    sortColumn: 'timestamp',
    sortDirection: 'desc' // 'asc' or 'desc'
  }
};

// ============================================================================
// 2. Storage Manager (LocalStorage Persistence)
// ============================================================================

const StorageManager = {
  KEYS: {
    SUBMISSIONS: 'novapost_submissions_v1',
    METRICS: 'novapost_metrics_v1',
    THEME: 'novapost_theme_v1',
    API_CHOICE: 'novapost_active_api_v1'
  },

  init() {
    // Load Theme
    const savedTheme = localStorage.getItem(this.KEYS.THEME) || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);

    // Load API Choice
    const savedApi = localStorage.getItem(this.KEYS.API_CHOICE);
    if (savedApi && API_CONFIG[savedApi]) {
      AppState.currentApi = savedApi;
    }

    // Load Metrics
    try {
      const savedMetrics = localStorage.getItem(this.KEYS.METRICS);
      if (savedMetrics) {
        AppState.metrics = JSON.parse(savedMetrics);
      }
    } catch (e) {
      console.warn('Could not parse saved metrics:', e);
    }

    // Load Submissions
    try {
      const savedSubmissions = localStorage.getItem(this.KEYS.SUBMISSIONS);
      if (savedSubmissions) {
        AppState.submissions = JSON.parse(savedSubmissions);
      } else {
        // Populate initial demo records for outstanding first impression
        this.seedInitialData();
      }
    } catch (e) {
      console.warn('Could not parse submissions:', e);
      this.seedInitialData();
    }
  },

  seedInitialData() {
    AppState.submissions = [
      {
        id: 195,
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        apiSource: 'DummyJSON',
        title: 'Sony WH-1000XM5 Wireless Headphones',
        category: 'audio',
        price: 399.99,
        brand: 'Sony Electronics',
        rating: 65,
        description: 'Industry-leading noise cancellation with dual processors for exceptional acoustic fidelity.',
        statusCode: 201,
        latency: 182,
        rawResponse: {
          id: 195,
          title: 'Sony WH-1000XM5 Wireless Headphones',
          price: 399.99,
          category: 'audio',
          brand: 'Sony Electronics',
          stock: 65,
          description: 'Industry-leading noise cancellation with dual processors for exceptional acoustic fidelity.'
        }
      },
      {
        id: 101,
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        apiSource: 'JSONPlaceholder',
        title: 'Building Resilient Real-Time REST Systems',
        category: 'productivity',
        price: 1,
        brand: 'Engineering Team',
        rating: 10,
        description: 'An architectural breakdown of HTTP POST semantics, payload validation, and reliable response handling.',
        statusCode: 201,
        latency: 145,
        rawResponse: {
          id: 101,
          title: 'Building Resilient Real-Time REST Systems',
          body: 'An architectural breakdown of HTTP POST semantics, payload validation, and reliable response handling.',
          userId: 1
        }
      }
    ];

    AppState.metrics = {
      totalRequests: 2,
      successfulRequests: 2,
      totalLatencyMs: 327
    };

    this.saveSubmissions();
    this.saveMetrics();
  },

  saveSubmissions() {
    try {
      localStorage.setItem(this.KEYS.SUBMISSIONS, JSON.stringify(AppState.submissions));
    } catch (e) {
      console.error('Failed to save submissions to localStorage:', e);
    }
  },

  saveMetrics() {
    try {
      localStorage.setItem(this.KEYS.METRICS, JSON.stringify(AppState.metrics));
    } catch (e) {
      console.error('Failed to save metrics to localStorage:', e);
    }
  },

  saveTheme(theme) {
    localStorage.setItem(this.KEYS.THEME, theme);
  },

  saveApiChoice(api) {
    localStorage.setItem(this.KEYS.API_CHOICE, api);
  },

  clearAll() {
    AppState.submissions = [];
    AppState.metrics = { totalRequests: 0, successfulRequests: 0, totalLatencyMs: 0 };
    this.saveSubmissions();
    this.saveMetrics();
  }
};

// ============================================================================
// 3. Toast Notification Service
// ============================================================================

const ToastService = {
  container: document.getElementById('toastContainer'),

  show(title, message, type = 'info', durationMs = 4000) {
    if (!this.container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let iconClass = 'fa-circle-info';
    if (type === 'success') iconClass = 'fa-circle-check';
    if (type === 'error') iconClass = 'fa-triangle-exclamation';
    if (type === 'warning') iconClass = 'fa-circle-exclamation';

    toast.innerHTML = `
      <i class="fa-solid ${iconClass} toast-icon"></i>
      <div class="toast-content">
        <div class="toast-title">${this.escapeHtml(title)}</div>
        <div class="toast-message">${this.escapeHtml(message)}</div>
      </div>
    `;

    this.container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast-exit');
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 300);
    }, durationMs);
  },

  escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
};

// ============================================================================
// 4. API Client (POST Request Dispatcher)
// ============================================================================

const ApiClient = {
  async sendPost(endpointKey, formData) {
    const config = API_CONFIG[endpointKey];
    if (!config) throw new Error(`Unknown API endpoint: ${endpointKey}`);

    const payload = config.formatPayload(formData);
    const url = config.url;

    const startTime = performance.now();

    // Setup abort controller for timeout safety (15s)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      const endTime = performance.now();
      const latency = Math.round(endTime - startTime);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status} ${response.statusText || 'Error'}: ${errorText.substring(0, 100)}`);
      }

      const responseData = await response.json();

      return {
        success: true,
        data: responseData,
        statusCode: response.status,
        latency: latency,
        payloadSent: payload,
        normalized: config.normalizeResponse(responseData, formData, latency, response.status)
      };
    } catch (error) {
      clearTimeout(timeoutId);
      const endTime = performance.now();
      const latency = Math.round(endTime - startTime);

      if (error.name === 'AbortError') {
        throw new Error('Request timed out after 15 seconds. Please check your network.');
      }
      throw error;
    }
  }
};

// ============================================================================
// 5. Form & Terminal Controller
// ============================================================================

const FormController = {
  form: document.getElementById('postApiForm'),
  apiSelect: document.getElementById('apiSelect'),
  titleInput: document.getElementById('inputTitle'),
  categoryInput: document.getElementById('inputCategory'),
  valueInput: document.getElementById('inputValue'),
  brandInput: document.getElementById('inputBrand'),
  ratingInput: document.getElementById('inputRating'),
  descInput: document.getElementById('inputDescription'),
  charCounter: document.getElementById('charCounter'),
  submitBtn: document.getElementById('btnSubmit'),
  submitText: document.getElementById('btnSubmitText'),

  // Dynamic Labels
  labelTitle: document.getElementById('labelTitle'),
  labelCategory: document.getElementById('labelCategory'),
  labelValue: document.getElementById('labelValue'),
  labelBrand: document.getElementById('labelBrand'),
  labelRating: document.getElementById('labelRating'),
  labelDesc: document.getElementById('labelDescription'),
  iconValue: document.getElementById('iconValue'),

  // Terminal elements
  terminalUrl: document.getElementById('terminalUrl'),
  terminalReqBody: document.getElementById('terminalRequestBody'),
  terminalRespStatus: document.getElementById('terminalResponseStatus'),
  terminalRespBody: document.getElementById('terminalResponseBody'),
  terminalLatency: document.getElementById('terminalLatency'),
  terminalTimestamp: document.getElementById('terminalTimestamp'),
  currentEndpointLabel: document.getElementById('currentEndpointLabel'),

  init() {
    this.updateEndpointUi(AppState.currentApi);
    this.bindEvents();
    this.updateLivePayload();
  },

  bindEvents() {
    // API Dropdown Switch
    this.apiSelect.value = AppState.currentApi;
    this.apiSelect.addEventListener('change', (e) => {
      AppState.currentApi = e.target.value;
      StorageManager.saveApiChoice(e.target.value);
      this.updateEndpointUi(e.target.value);
      this.updateLivePayload();
      ToastService.show('API Target Switched', `Active endpoint: ${API_CONFIG[e.target.value].name}`, 'info', 2500);
    });

    // Input changes for live payload update
    const inputs = [this.titleInput, this.categoryInput, this.valueInput, this.brandInput, this.ratingInput, this.descInput];
    inputs.forEach(input => {
      input.addEventListener('input', () => {
        this.updateLivePayload();
        this.validateField(input);
      });
    });

    // Character counter for textarea
    this.descInput.addEventListener('input', () => {
      const len = this.descInput.value.length;
      this.charCounter.textContent = `${len} / 500`;
      if (len > 500) {
        this.charCounter.style.color = 'var(--danger)';
      } else {
        this.charCounter.style.color = 'var(--text-muted)';
      }
    });

    // Quick Action: Fill Sample
    document.getElementById('btnFillSample').addEventListener('click', () => this.fillSampleData());

    // Quick Action: Preview Payload Modal
    document.getElementById('btnPreviewPayload').addEventListener('click', () => {
      const formData = this.getFormData();
      const config = API_CONFIG[AppState.currentApi];
      const payload = config.formatPayload(formData);
      ModalController.openResponseModal(
        {
          targetUrl: config.url,
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          payload: payload
        },
        'Payload Preview (Pre-dispatch)',
        200,
        0,
        config.name
      );
    });

    // Quick Action: Reset
    document.getElementById('btnResetForm').addEventListener('click', () => this.resetForm());

    // Quick Action: Copy Endpoint URL
    document.getElementById('btnCopyEndpoint').addEventListener('click', () => {
      const url = API_CONFIG[AppState.currentApi].url;
      navigator.clipboard.writeText(url).then(() => {
        ToastService.show('Copied!', 'Target API URL copied to clipboard', 'info', 2000);
      });
    });

    // Form Submit
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
  },

  updateEndpointUi(apiId) {
    const config = API_CONFIG[apiId];
    if (!config) return;

    this.terminalUrl.textContent = config.url;
    if (this.currentEndpointLabel) {
      this.currentEndpointLabel.textContent = config.name.split(' ')[0] + ' API';
    }

    // Update labels and placeholders
    const f = config.fields;
    this.labelTitle.textContent = f.titleLabel;
    this.titleInput.placeholder = f.titlePlaceholder;
    this.labelCategory.textContent = f.categoryLabel;
    this.labelValue.textContent = f.valueLabel;
    this.valueInput.placeholder = f.valuePlaceholder;
    this.labelBrand.textContent = f.brandLabel;
    this.brandInput.placeholder = f.brandPlaceholder;
    this.labelRating.textContent = f.ratingLabel;
    this.ratingInput.placeholder = f.ratingPlaceholder;
    this.labelDesc.textContent = f.descLabel;

    if (f.valueIcon && this.iconValue) {
      this.iconValue.className = `fa-solid ${f.valueIcon} input-icon`;
    }
  },

  getFormData() {
    return {
      title: this.titleInput.value,
      category: this.categoryInput.value || 'general',
      value: this.valueInput.value,
      brand: this.brandInput.value,
      rating: this.ratingInput.value,
      description: this.descInput.value
    };
  },

  fillSampleData() {
    const config = API_CONFIG[AppState.currentApi];
    const samples = config.sampleData;
    const sample = samples[Math.floor(Math.random() * samples.length)];

    this.titleInput.value = sample.title;
    this.categoryInput.value = sample.category;
    this.valueInput.value = sample.value;
    this.brandInput.value = sample.brand;
    this.ratingInput.value = sample.rating;
    this.descInput.value = sample.description;

    this.charCounter.textContent = `${sample.description.length} / 500`;

    // Clear validation styles
    [this.titleInput, this.categoryInput, this.valueInput, this.descInput].forEach(el => {
      el.classList.remove('is-invalid');
      el.classList.add('is-valid');
    });

    this.updateLivePayload();
    ToastService.show('Sample Data Loaded', `Generated sample for ${config.name}`, 'info', 2000);
  },

  updateLivePayload() {
    const formData = this.getFormData();
    const config = API_CONFIG[AppState.currentApi];
    const payload = config.formatPayload(formData);

    const fullPreview = {
      method: "POST",
      url: config.url,
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: payload
    };

    this.terminalReqBody.textContent = JSON.stringify(fullPreview, null, 2);
  },

  validateField(input) {
    if (!input.required && !input.value) {
      input.classList.remove('is-invalid', 'is-valid');
      return true;
    }

    const isValid = input.checkValidity();
    if (isValid) {
      input.classList.remove('is-invalid');
      input.classList.add('is-valid');
    } else {
      input.classList.add('is-invalid');
      input.classList.remove('is-valid');
    }
    return isValid;
  },

  validateForm() {
    let isValid = true;
    const requiredInputs = [this.titleInput, this.categoryInput, this.valueInput, this.descInput];

    requiredInputs.forEach(input => {
      if (!this.validateField(input)) {
        isValid = false;
      }
    });

    if (!isValid) {
      ToastService.show('Validation Error', 'Please complete all required fields correctly.', 'warning', 3000);
    }
    return isValid;
  },

  resetForm() {
    this.form.reset();
    this.charCounter.textContent = '0 / 500';
    [this.titleInput, this.categoryInput, this.valueInput, this.brandInput, this.ratingInput, this.descInput].forEach(el => {
      el.classList.remove('is-invalid', 'is-valid');
    });
    this.updateLivePayload();
    ToastService.show('Form Reset', 'All input fields cleared', 'info', 1500);
  },

  setLoading(isLoading) {
    if (isLoading) {
      this.submitBtn.classList.add('is-loading');
      this.submitText.textContent = 'Dispatching POST...';
      this.submitBtn.disabled = true;
    } else {
      this.submitBtn.classList.remove('is-loading');
      this.submitText.textContent = 'Send POST Request';
      this.submitBtn.disabled = false;
    }
  },

  async handleSubmit(e) {
    e.preventDefault();

    if (!this.validateForm()) {
      return;
    }

    const formData = this.getFormData();
    const endpointKey = AppState.currentApi;
    const config = API_CONFIG[endpointKey];

    this.setLoading(true);
    this.terminalRespStatus.className = 'response-status-badge badge-warning';
    this.terminalRespStatus.textContent = 'Processing...';
    this.terminalResponseBody.textContent = '// Sending HTTP POST payload over network...';

    try {
      const result = await ApiClient.sendPost(endpointKey, formData);

      // Update terminal
      this.terminalRespStatus.className = 'response-status-badge badge-success';
      this.terminalRespStatus.textContent = `${result.statusCode} Created`;
      this.terminalResponseBody.textContent = JSON.stringify(result.data, null, 2);
      this.terminalLatency.textContent = `${result.latency} ms`;
      this.terminalTimestamp.textContent = new Date().toLocaleTimeString();

      // Update State
      AppState.submissions.unshift(result.normalized);
      AppState.metrics.totalRequests++;
      AppState.metrics.successfulRequests++;
      AppState.metrics.totalLatencyMs += result.latency;

      StorageManager.saveSubmissions();
      StorageManager.saveMetrics();

      // Refresh Dashboard & Table
      MetricsController.render();
      TableController.render();

      ToastService.show(
        'POST Request Succeeded!',
        `Server assigned ID #${result.normalized.id} (${result.latency}ms)`,
        'success',
        4000
      );

    } catch (error) {
      console.error('Submission failed:', error);

      this.terminalRespStatus.className = 'response-status-badge badge-danger';
      this.terminalRespStatus.textContent = 'Failed';
      this.terminalResponseBody.textContent = `// Error:\n${error.message}`;
      this.terminalLatency.textContent = '-- ms';
      this.terminalTimestamp.textContent = new Date().toLocaleTimeString();

      AppState.metrics.totalRequests++;
      StorageManager.saveMetrics();
      MetricsController.render();

      ToastService.show('API Request Failed', error.message, 'error', 5000);
    } finally {
      this.setLoading(false);
    }
  }
};

// ============================================================================
// 6. Table Controller (Rendering, Filtering, Sorting, Exporting)
// ============================================================================

const TableController = {
  tableBody: document.getElementById('tableBody'),
  emptyState: document.getElementById('tableEmptyState'),
  recordCount: document.getElementById('tableRecordCount'),
  searchInput: document.getElementById('tableSearch'),
  clearSearchBtn: document.getElementById('btnClearSearch'),
  categoryFilter: document.getElementById('tableCategoryFilter'),
  tableHeaders: document.querySelectorAll('.data-table th.sortable'),

  init() {
    this.bindEvents();
    this.render();
  },

  bindEvents() {
    // Search input
    this.searchInput.addEventListener('input', (e) => {
      AppState.table.searchQuery = e.target.value.trim().toLowerCase();
      if (e.target.value) {
        this.clearSearchBtn.classList.remove('hidden');
      } else {
        this.clearSearchBtn.classList.add('hidden');
      }
      this.render();
    });

    // Clear Search
    this.clearSearchBtn.addEventListener('click', () => {
      this.searchInput.value = '';
      AppState.table.searchQuery = '';
      this.clearSearchBtn.classList.add('hidden');
      this.render();
    });

    // Category filter
    this.categoryFilter.addEventListener('change', (e) => {
      AppState.table.categoryFilter = e.target.value;
      this.render();
    });

    // Sorting Headers
    this.tableHeaders.forEach(th => {
      th.addEventListener('click', () => {
        const col = th.getAttribute('data-sort');
        if (AppState.table.sortColumn === col) {
          AppState.table.sortDirection = AppState.table.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
          AppState.table.sortColumn = col;
          AppState.table.sortDirection = 'asc';
        }
        this.updateSortHeaderStyles();
        this.render();
      });
    });

    // Export CSV
    document.getElementById('btnExportCsv').addEventListener('click', () => this.exportCsv());

    // Export JSON
    document.getElementById('btnExportJson').addEventListener('click', () => this.exportJson());

    // Clear History
    document.getElementById('btnClearHistory').addEventListener('click', () => {
      if (AppState.submissions.length === 0) {
        ToastService.show('Table is empty', 'No submissions to clear', 'info', 2000);
        return;
      }
      if (confirm('Are you sure you want to clear all submitted records from your local history?')) {
        StorageManager.clearAll();
        this.render();
        MetricsController.render();
        ToastService.show('History Cleared', 'All stored submissions have been removed.', 'warning', 3000);
      }
    });

    // Empty state load sample button
    const btnEmptySample = document.getElementById('btnEmptySample');
    if (btnEmptySample) {
      btnEmptySample.addEventListener('click', () => {
        FormController.fillSampleData();
        FormController.form.dispatchEvent(new Event('submit', { cancelable: true }));
      });
    }
  },

  updateSortHeaderStyles() {
    this.tableHeaders.forEach(th => {
      const col = th.getAttribute('data-sort');
      th.classList.remove('sort-asc', 'sort-desc');
      if (col === AppState.table.sortColumn) {
        th.classList.add(AppState.table.sortDirection === 'asc' ? 'sort-asc' : 'sort-desc');
      }
    });
  },

  getFilteredAndSortedData() {
    let items = [...AppState.submissions];

    // 1. Filter by category
    if (AppState.table.categoryFilter !== 'ALL') {
      items = items.filter(item => (item.category || '').toLowerCase() === AppState.table.categoryFilter.toLowerCase());
    }

    // 2. Filter by search query
    if (AppState.table.searchQuery) {
      const q = AppState.table.searchQuery;
      items = items.filter(item => {
        const titleMatch = (item.title || '').toLowerCase().includes(q);
        const descMatch = (item.description || '').toLowerCase().includes(q);
        const catMatch = (item.category || '').toLowerCase().includes(q);
        const idMatch = String(item.id || '').includes(q);
        const brandMatch = (item.brand || '').toLowerCase().includes(q);
        return titleMatch || descMatch || catMatch || idMatch || brandMatch;
      });
    }

    // 3. Sort
    const col = AppState.table.sortColumn;
    const dir = AppState.table.sortDirection === 'asc' ? 1 : -1;

    items.sort((a, b) => {
      let valA = a[col];
      let valB = b[col];

      if (col === 'timestamp') {
        return (new Date(valA) - new Date(valB)) * dir;
      }
      if (col === 'id') {
        return ((parseInt(valA, 10) || 0) - (parseInt(valB, 10) || 0)) * dir;
      }
      if (col === 'price') {
        const numA = parseFloat(String(valA).replace(/[^0-9.-]+/g, '')) || 0;
        const numB = parseFloat(String(valB).replace(/[^0-9.-]+/g, '')) || 0;
        return (numA - numB) * dir;
      }
      if (typeof valA === 'string') {
        return valA.localeCompare(String(valB)) * dir;
      }
      return ((valA || 0) - (valB || 0)) * dir;
    });

    return items;
  },

  render() {
    const items = this.getFilteredAndSortedData();
    this.recordCount.textContent = `${items.length} ${items.length === 1 ? 'record' : 'records'}`;

    if (items.length === 0) {
      this.tableBody.innerHTML = '';
      this.emptyState.classList.remove('hidden');
      return;
    }

    this.emptyState.classList.add('hidden');

    let html = '';
    items.forEach((item, index) => {
      const dateFormatted = new Date(item.timestamp).toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });

      const displayPrice = typeof item.price === 'number' ? `$${item.price.toFixed(2)}` : (item.price || '$0.00');

      html += `
        <tr data-id="${item.id}">
          <td class="cell-id">#${item.id}</td>
          <td class="cell-timestamp" title="${item.timestamp}">${dateFormatted}</td>
          <td class="cell-title" title="${this.escapeAttr(item.title)}">
            <strong>${this.escapeHtml(item.title)}</strong>
          </td>
          <td>
            <span class="badge badge-subtle">${this.escapeHtml(item.category || 'General')}</span>
          </td>
          <td class="cell-price">${displayPrice}</td>
          <td class="cell-desc" title="${this.escapeAttr(item.description)}">
            ${this.escapeHtml(item.description)}
          </td>
          <td>
            <span class="badge badge-success">
              <i class="fa-solid fa-check"></i> ${item.statusCode || 201}
            </span>
          </td>
          <td class="cell-actions">
            <button class="btn btn-icon btn-xs btn-outline btn-view-json" data-index="${index}" title="Inspect Full API Response">
              <i class="fa-solid fa-code"></i>
            </button>
            <button class="btn btn-icon btn-xs btn-outline btn-copy-row" data-index="${index}" title="Copy JSON">
              <i class="fa-regular fa-copy"></i>
            </button>
            <button class="btn btn-icon btn-xs btn-danger-ghost btn-delete-row" data-id="${item.id}" title="Remove Entry">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </td>
        </tr>
      `;
    });

    this.tableBody.innerHTML = html;

    // Attach row action listeners
    this.attachRowEvents(items);
  },

  attachRowEvents(currentItems) {
    // View JSON Modal
    this.tableBody.querySelectorAll('.btn-view-json').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-index'), 10);
        const item = currentItems[idx];
        if (item) {
          ModalController.openResponseModal(
            item.rawResponse || item,
            `Response for: ${item.title}`,
            item.statusCode || 201,
            item.latency || 0,
            item.apiSource || 'REST API'
          );
        }
      });
    });

    // Copy Row JSON
    this.tableBody.querySelectorAll('.btn-copy-row').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-index'), 10);
        const item = currentItems[idx];
        if (item) {
          navigator.clipboard.writeText(JSON.stringify(item.rawResponse || item, null, 2)).then(() => {
            ToastService.show('Copied!', 'Item response payload copied to clipboard', 'info', 2000);
          });
        }
      });
    });

    // Delete Single Row
    this.tableBody.querySelectorAll('.btn-delete-row').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        AppState.submissions = AppState.submissions.filter(s => String(s.id) !== String(id));
        StorageManager.saveSubmissions();
        this.render();
        MetricsController.render();
        ToastService.show('Deleted', `Record #${id} removed.`, 'info', 2000);
      });
    });
  },

  exportCsv() {
    if (AppState.submissions.length === 0) {
      ToastService.show('Export Empty', 'No submissions to export', 'warning', 2000);
      return;
    }

    const headers = ['ID', 'Timestamp', 'API Source', 'Title', 'Category', 'Price/Value', 'Brand/Author', 'Description', 'Status Code', 'Latency (ms)'];
    const rows = AppState.submissions.map(item => [
      item.id,
      `"${item.timestamp}"`,
      `"${(item.apiSource || '').replace(/"/g, '""')}"`,
      `"${(item.title || '').replace(/"/g, '""')}"`,
      `"${(item.category || '').replace(/"/g, '""')}"`,
      `"${item.price || 0}"`,
      `"${(item.brand || '').replace(/"/g, '""')}"`,
      `"${(item.description || '').replace(/"/g, '""')}"`,
      item.statusCode || 201,
      item.latency || 0
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `novapost_api_records_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    ToastService.show('CSV Exported', 'Downloaded submissions spreadsheet', 'success', 2500);
  },

  exportJson() {
    if (AppState.submissions.length === 0) {
      ToastService.show('Export Empty', 'No submissions to export', 'warning', 2000);
      return;
    }

    const jsonStr = JSON.stringify(AppState.submissions, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `novapost_api_records_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    ToastService.show('JSON Exported', 'Downloaded submissions raw JSON', 'success', 2500);
  },

  escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  },

  escapeAttr(str) {
    if (!str) return '';
    return String(str).replace(/"/g, '&quot;');
  }
};

// ============================================================================
// 7. Metrics Dashboard Controller
// ============================================================================

const MetricsController = {
  statTotalRequests: document.getElementById('statTotalRequests'),
  statSuccessRate: document.getElementById('statSuccessRate'),
  statAvgLatency: document.getElementById('statAvgLatency'),
  statTotalRecords: document.getElementById('statTotalRecords'),

  render() {
    const { totalRequests, successfulRequests, totalLatencyMs } = AppState.metrics;
    
    this.statTotalRequests.textContent = totalRequests;
    
    const rate = totalRequests > 0 ? Math.round((successfulRequests / totalRequests) * 100) : 100;
    this.statSuccessRate.textContent = `${rate}%`;

    const avgLatency = successfulRequests > 0 ? Math.round(totalLatencyMs / successfulRequests) : 0;
    this.statAvgLatency.textContent = `${avgLatency} ms`;

    this.statTotalRecords.textContent = AppState.submissions.length;
  }
};

// ============================================================================
// 8. Modals & Theme Controller
// ============================================================================

const ModalController = {
  responseModal: document.getElementById('responseModal'),
  modalTitle: document.getElementById('modalTitle'),
  modalJsonContent: document.getElementById('modalJsonContent'),
  modalStatusCode: document.getElementById('modalStatusCode'),
  modalLatency: document.getElementById('modalLatency'),
  modalApiSource: document.getElementById('modalApiSource'),
  btnCopyModalJson: document.getElementById('btnCopyModalJson'),

  guideModal: document.getElementById('guideModal'),

  init() {
    // Response Modal Close
    document.getElementById('btnCloseModal').addEventListener('click', () => this.closeResponseModal());
    document.getElementById('btnCloseModalBottom').addEventListener('click', () => this.closeResponseModal());

    // Guide Modal Open/Close
    document.getElementById('guideBtn').addEventListener('click', () => this.openGuideModal());
    document.getElementById('btnCloseGuideModal').addEventListener('click', () => this.closeGuideModal());
    document.getElementById('btnCloseGuideBottom').addEventListener('click', () => this.closeGuideModal());

    // Copy modal content
    this.btnCopyModalJson.addEventListener('click', () => {
      const text = this.modalJsonContent.textContent;
      navigator.clipboard.writeText(text).then(() => {
        ToastService.show('Copied!', 'JSON payload copied to clipboard', 'info', 2000);
      });
    });

    // Close on backdrop click
    [this.responseModal, this.guideModal].forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.closeResponseModal();
          this.closeGuideModal();
        }
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeResponseModal();
        this.closeGuideModal();
      }
    });
  },

  openResponseModal(data, title = 'API Response Inspector', statusCode = 201, latency = 0, source = 'REST API') {
    this.modalTitle.textContent = title;
    this.modalJsonContent.textContent = JSON.stringify(data, null, 2);
    this.modalStatusCode.textContent = `${statusCode} OK`;
    this.modalLatency.textContent = `${latency} ms`;
    this.modalApiSource.textContent = source;
    this.responseModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  },

  closeResponseModal() {
    this.responseModal.classList.add('hidden');
    document.body.style.overflow = '';
  },

  openGuideModal() {
    this.guideModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  },

  closeGuideModal() {
    this.guideModal.classList.add('hidden');
    document.body.style.overflow = '';
  }
};

const ThemeController = {
  toggleBtn: document.getElementById('themeToggleBtn'),

  init() {
    this.toggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      StorageManager.saveTheme(newTheme);
      ToastService.show('Theme Changed', `Switched to ${newTheme} mode`, 'info', 1500);
    });
  }
};

// ============================================================================
// 9. App Bootstrap
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
  StorageManager.init();
  ThemeController.init();
  ModalController.init();
  FormController.init();
  TableController.init();
  MetricsController.render();

  // Welcome toast
  setTimeout(() => {
    ToastService.show('NovaPost Ready', 'Connected to public POST REST endpoints.', 'info', 3000);
  }, 500);
});
