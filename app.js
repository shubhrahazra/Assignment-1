/**
 * NovaPost — Modern Public REST API POST Client & Data Manager
 * Pure Vanilla JavaScript (ES6+)
 */

// ============================================================================
// 1. Configuration & State Management
// ============================================================================

const API_CONFIG = {
  posts: {
    name: 'JSONPlaceholder Posts API',
    url: 'https://jsonplaceholder.typicode.com/posts',
    method: 'POST',
    fields: {
      titleLabel: 'Post Title / Headline',
      titlePlaceholder: 'Enter post title (e.g. Asynchronous JavaScript Deep Dive)',
      categoryLabel: 'Category / Topic',
      valueLabel: 'User / Author ID (1-100)',
      valuePlaceholder: 'e.g. 1',
      valueIcon: 'fa-user',
      brandLabel: 'Author / Tag',
      brandPlaceholder: 'e.g. Alex Rivera',
      ratingLabel: 'Read Time (Minutes)',
      ratingPlaceholder: 'e.g. 5',
      descLabel: 'Post Content / Body'
    },
    formatPayload: (form) => ({
      title: (form.title || '').trim(),
      body: (form.description || '').trim(),
      userId: parseInt(form.value, 10) || 1
    }),
    normalizeResponse: (res, inputData, latency, statusCode) => ({
      id: res.id || 101,
      timestamp: new Date().toISOString(),
      apiSource: 'JSONPlaceholder (Posts)',
      title: res.title || inputData.title || 'Untitled Post',
      category: inputData.category || 'General',
      price: inputData.value || 1,
      brand: inputData.brand || 'Author',
      rating: inputData.rating || 5,
      description: res.body || inputData.description || '',
      statusCode: statusCode || 201,
      latency: latency || 1,
      rawResponse: res
    })
  },

  comments: {
    name: 'JSONPlaceholder Comments API',
    url: 'https://jsonplaceholder.typicode.com/comments',
    method: 'POST',
    fields: {
      titleLabel: 'Comment Subject / Name',
      titlePlaceholder: 'Enter comment subject (e.g. Feedback on API architecture)',
      categoryLabel: 'Department / Context',
      valueLabel: 'Post ID Target (1-100)',
      valuePlaceholder: 'e.g. 1',
      valueIcon: 'fa-hashtag',
      brandLabel: 'Author Email',
      brandPlaceholder: 'e.g. dev@example.com',
      ratingLabel: 'Feedback Rating (1-5)',
      ratingPlaceholder: 'e.g. 5',
      descLabel: 'Comment Body / Content'
    },
    formatPayload: (form) => ({
      name: (form.title || '').trim(),
      email: form.brand ? form.brand.trim() : 'user@example.com',
      body: (form.description || '').trim(),
      postId: parseInt(form.value, 10) || 1
    }),
    normalizeResponse: (res, inputData, latency, statusCode) => ({
      id: res.id || 501,
      timestamp: new Date().toISOString(),
      apiSource: 'JSONPlaceholder (Comments)',
      title: res.name || inputData.title || 'Untitled Comment',
      category: inputData.category || 'General',
      price: inputData.value || 1,
      brand: res.email || inputData.brand || 'User',
      rating: inputData.rating || 5,
      description: res.body || inputData.description || '',
      statusCode: statusCode || 201,
      latency: latency || 1,
      rawResponse: res
    })
  },

  todos: {
    name: 'JSONPlaceholder Todos API',
    url: 'https://jsonplaceholder.typicode.com/todos',
    method: 'POST',
    fields: {
      titleLabel: 'Task Title / Activity',
      titlePlaceholder: 'Enter task description (e.g. Complete REST API integration)',
      categoryLabel: 'Task Priority / Category',
      valueLabel: 'User ID (1-100)',
      valuePlaceholder: 'e.g. 1',
      valueIcon: 'fa-user-check',
      brandLabel: 'Assigned Team',
      brandPlaceholder: 'e.g. Frontend Team',
      ratingLabel: 'Estimated Hours',
      ratingPlaceholder: 'e.g. 4',
      descLabel: 'Task Requirements & Details'
    },
    formatPayload: (form) => ({
      title: (form.title || '').trim(),
      completed: false,
      userId: parseInt(form.value, 10) || 1
    }),
    normalizeResponse: (res, inputData, latency, statusCode) => ({
      id: res.id || 201,
      timestamp: new Date().toISOString(),
      apiSource: 'JSONPlaceholder (Todos)',
      title: res.title || inputData.title || 'Untitled Task',
      category: inputData.category || 'General',
      price: inputData.value || 1,
      brand: inputData.brand || 'Team',
      rating: inputData.rating || 1,
      description: inputData.description || 'Task created successfully',
      statusCode: statusCode || 201,
      latency: latency || 1,
      rawResponse: res
    })
  }
};

// Initial State
const AppState = {
  currentApi: 'posts',
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
    sortDirection: 'desc'
  }
};

// ============================================================================
// 2. Storage Manager (LocalStorage Persistence)
// ============================================================================

const StorageManager = {
  KEYS: {
    SUBMISSIONS: 'novapost_submissions_clean_v3',
    METRICS: 'novapost_metrics_clean_v3',
    THEME: 'novapost_theme_clean_v3',
    API_CHOICE: 'novapost_api_choice_clean_v3'
  },

  init() {
    // Load Theme
    const savedTheme = localStorage.getItem(this.KEYS.THEME) || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);

    // Load API Choice safely
    const savedApi = localStorage.getItem(this.KEYS.API_CHOICE);
    if (savedApi && API_CONFIG[savedApi]) {
      AppState.currentApi = savedApi;
    } else {
      AppState.currentApi = 'posts';
    }

    // Load Metrics
    try {
      const savedMetrics = localStorage.getItem(this.KEYS.METRICS);
      if (savedMetrics) {
        AppState.metrics = JSON.parse(savedMetrics);
      }
    } catch (e) {
      console.warn('Could not parse metrics:', e);
    }

    // Load Submissions
    try {
      const savedSubmissions = localStorage.getItem(this.KEYS.SUBMISSIONS);
      if (savedSubmissions) {
        AppState.submissions = JSON.parse(savedSubmissions);
      }
    } catch (e) {
      console.warn('Could not parse submissions:', e);
      AppState.submissions = [];
    }
  },

  saveSubmissions() {
    try {
      localStorage.setItem(this.KEYS.SUBMISSIONS, JSON.stringify(AppState.submissions));
    } catch (e) {
      console.error('Failed to save submissions:', e);
    }
  },

  saveMetrics() {
    try {
      localStorage.setItem(this.KEYS.METRICS, JSON.stringify(AppState.metrics));
    } catch (e) {
      console.error('Failed to save metrics:', e);
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
  show(title, message, type = 'info', durationMs = 4000) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

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

    container.appendChild(toast);

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
    const activeKey = API_CONFIG[endpointKey] ? endpointKey : 'posts';
    const config = API_CONFIG[activeKey];

    const payload = config.formatPayload(formData);
    const url = config.url;

    console.log(`[NovaPost] Dispatching POST to: ${url}`, payload);
    const startTime = performance.now();

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

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
      const latency = Math.max(1, Math.round(endTime - startTime));

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status} ${response.statusText || 'Error'}: ${errorText.substring(0, 100)}`);
      }

      const responseData = await response.json();
      console.log(`[NovaPost] Server Response (${latency}ms):`, responseData);

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
      const latency = Math.max(1, Math.round(endTime - startTime));

      if (error.name === 'AbortError') {
        throw new Error('Request timed out after 8s. Please check your internet connection.');
      }
      throw error;
    }
  }
};

// ============================================================================
// 5. Form & Terminal Controller
// ============================================================================

const FormController = {
  init() {
    // Query elements inside init after DOM is fully ready
    this.form = document.getElementById('postApiForm');
    this.apiSelect = document.getElementById('apiSelect');
    this.titleInput = document.getElementById('inputTitle');
    this.categoryInput = document.getElementById('inputCategory');
    this.valueInput = document.getElementById('inputValue');
    this.brandInput = document.getElementById('inputBrand');
    this.ratingInput = document.getElementById('inputRating');
    this.descInput = document.getElementById('inputDescription');
    this.charCounter = document.getElementById('charCounter');
    this.submitBtn = document.getElementById('btnSubmit');
    this.submitText = document.getElementById('btnSubmitText');

    this.labelTitle = document.getElementById('labelTitle');
    this.labelCategory = document.getElementById('labelCategory');
    this.labelValue = document.getElementById('labelValue');
    this.labelBrand = document.getElementById('labelBrand');
    this.labelRating = document.getElementById('labelRating');
    this.labelDesc = document.getElementById('labelDescription');
    this.iconValue = document.getElementById('iconValue');

    this.terminalUrl = document.getElementById('terminalUrl');
    this.terminalReqBody = document.getElementById('terminalRequestBody');
    this.terminalRespStatus = document.getElementById('terminalResponseStatus');
    this.terminalRespBody = document.getElementById('terminalResponseBody');
    this.terminalLatency = document.getElementById('terminalLatency');
    this.terminalTimestamp = document.getElementById('terminalTimestamp');
    this.currentEndpointLabel = document.getElementById('currentEndpointLabel');

    if (!this.form) return;

    this.updateEndpointUi(AppState.currentApi);
    this.bindEvents();
    this.updateLivePayload();
  },

  bindEvents() {
    if (this.apiSelect) {
      this.apiSelect.value = AppState.currentApi;
      this.apiSelect.addEventListener('change', (e) => {
        AppState.currentApi = e.target.value;
        StorageManager.saveApiChoice(e.target.value);
        this.updateEndpointUi(e.target.value);
        this.updateLivePayload();
        ToastService.show('API Endpoint Selected', `${API_CONFIG[e.target.value]?.name || 'REST API'}`, 'info', 2500);
      });
    }

    const inputs = [this.titleInput, this.categoryInput, this.valueInput, this.brandInput, this.ratingInput, this.descInput].filter(Boolean);
    inputs.forEach(input => {
      input.addEventListener('input', () => {
        this.updateLivePayload();
        this.validateField(input);
      });
    });

    if (this.descInput && this.charCounter) {
      this.descInput.addEventListener('input', () => {
        const len = this.descInput.value.length;
        this.charCounter.textContent = `${len} / 500`;
        this.charCounter.style.color = len > 500 ? 'var(--danger)' : 'var(--text-muted)';
      });
    }

    const btnPreview = document.getElementById('btnPreviewPayload');
    if (btnPreview) {
      btnPreview.addEventListener('click', () => {
        const formData = this.getFormData();
        const config = API_CONFIG[AppState.currentApi] || API_CONFIG.posts;
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
    }

    const btnReset = document.getElementById('btnResetForm');
    if (btnReset) {
      btnReset.addEventListener('click', () => this.resetForm());
    }

    const btnCopyUrl = document.getElementById('btnCopyEndpoint');
    if (btnCopyUrl) {
      btnCopyUrl.addEventListener('click', () => {
        const config = API_CONFIG[AppState.currentApi] || API_CONFIG.posts;
        navigator.clipboard.writeText(config.url).then(() => {
          ToastService.show('Copied!', 'Target API URL copied to clipboard', 'info', 2000);
        });
      });
    }

    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
  },

  updateEndpointUi(apiId) {
    const config = API_CONFIG[apiId] || API_CONFIG.posts;

    if (this.terminalUrl) this.terminalUrl.textContent = config.url;
    if (this.currentEndpointLabel) this.currentEndpointLabel.textContent = config.name.replace('JSONPlaceholder ', '');

    const f = config.fields;
    if (this.labelTitle && f.titleLabel) this.labelTitle.textContent = f.titleLabel;
    if (this.titleInput && f.titlePlaceholder) this.titleInput.placeholder = f.titlePlaceholder;
    if (this.labelCategory && f.categoryLabel) this.labelCategory.textContent = f.categoryLabel;
    if (this.labelValue && f.valueLabel) this.labelValue.textContent = f.valueLabel;
    if (this.valueInput && f.valuePlaceholder) this.valueInput.placeholder = f.valuePlaceholder;
    if (this.labelBrand && f.brandLabel) this.labelBrand.textContent = f.brandLabel;
    if (this.brandInput && f.brandPlaceholder) this.brandInput.placeholder = f.brandPlaceholder;
    if (this.labelRating && f.ratingLabel) this.labelRating.textContent = f.ratingLabel;
    if (this.ratingInput && f.ratingPlaceholder) this.ratingInput.placeholder = f.ratingPlaceholder;
    if (this.labelDesc && f.descLabel) this.labelDesc.textContent = f.descLabel;

    if (f.valueIcon && this.iconValue) {
      this.iconValue.className = `fa-solid ${f.valueIcon} input-icon`;
    }
  },

  getFormData() {
    return {
      title: this.titleInput ? this.titleInput.value : '',
      category: this.categoryInput ? this.categoryInput.value || 'General' : 'General',
      value: this.valueInput ? this.valueInput.value : '1',
      brand: this.brandInput ? this.brandInput.value : '',
      rating: this.ratingInput ? this.ratingInput.value : '5',
      description: this.descInput ? this.descInput.value : ''
    };
  },

  updateLivePayload() {
    const formData = this.getFormData();
    const config = API_CONFIG[AppState.currentApi] || API_CONFIG.posts;
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

    if (this.terminalReqBody) {
      this.terminalReqBody.textContent = JSON.stringify(fullPreview, null, 2);
    }
  },

  validateField(input) {
    if (!input) return true;
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
    const requiredInputs = [this.titleInput, this.categoryInput, this.valueInput, this.descInput].filter(Boolean);

    requiredInputs.forEach(input => {
      if (!this.validateField(input)) {
        isValid = false;
      }
    });

    if (!isValid) {
      ToastService.show('Required Fields Missing', 'Please fill in all required fields.', 'warning', 3000);
    }
    return isValid;
  },

  resetForm() {
    if (this.form) this.form.reset();
    if (this.charCounter) this.charCounter.textContent = '0 / 500';
    [this.titleInput, this.categoryInput, this.valueInput, this.brandInput, this.ratingInput, this.descInput].filter(Boolean).forEach(el => {
      el.classList.remove('is-invalid', 'is-valid');
    });
    this.updateLivePayload();
    ToastService.show('Form Reset', 'Form inputs cleared', 'info', 1500);
  },

  setLoading(isLoading) {
    if (!this.submitBtn) return;
    if (isLoading) {
      this.submitBtn.classList.add('is-loading');
      if (this.submitText) this.submitText.textContent = 'Sending POST...';
      this.submitBtn.disabled = true;
    } else {
      this.submitBtn.classList.remove('is-loading');
      if (this.submitText) this.submitText.textContent = 'Send POST Request';
      this.submitBtn.disabled = false;
    }
  },

  async handleSubmit(e) {
    if (e && e.preventDefault) e.preventDefault();

    if (!this.validateForm()) {
      return;
    }

    const formData = this.getFormData();
    const endpointKey = AppState.currentApi || 'posts';

    this.setLoading(true);

    if (this.terminalRespStatus) {
      this.terminalRespStatus.className = 'response-status-badge badge-warning';
      this.terminalRespStatus.textContent = 'Processing...';
    }
    if (this.terminalResponseBody) {
      this.terminalResponseBody.textContent = '// Sending HTTP POST payload over network...';
    }

    try {
      const result = await ApiClient.sendPost(endpointKey, formData);

      if (this.terminalRespStatus) {
        this.terminalRespStatus.className = 'response-status-badge badge-success';
        this.terminalRespStatus.textContent = `${result.statusCode} Created`;
      }
      if (this.terminalResponseBody) {
        this.terminalResponseBody.textContent = JSON.stringify(result.data, null, 2);
      }
      if (this.terminalLatency) {
        this.terminalLatency.textContent = `${result.latency} ms`;
      }
      if (this.terminalTimestamp) {
        this.terminalTimestamp.textContent = new Date().toLocaleTimeString();
      }

      AppState.submissions.unshift(result.normalized);
      AppState.metrics.totalRequests++;
      AppState.metrics.successfulRequests++;
      AppState.metrics.totalLatencyMs += result.latency;

      StorageManager.saveSubmissions();
      StorageManager.saveMetrics();

      MetricsController.render();
      TableController.render();

      ToastService.show(
        'POST Request Succeeded!',
        `Server returned response ID #${result.normalized.id} (${result.latency}ms)`,
        'success',
        4000
      );

      this.resetForm();

    } catch (error) {
      console.error('Submission failed:', error);

      if (this.terminalRespStatus) {
        this.terminalRespStatus.className = 'response-status-badge badge-danger';
        this.terminalRespStatus.textContent = 'Failed';
      }
      if (this.terminalResponseBody) {
        this.terminalResponseBody.textContent = `// Error:\n${error.message}`;
      }
      if (this.terminalLatency) {
        this.terminalLatency.textContent = '-- ms';
      }
      if (this.terminalTimestamp) {
        this.terminalTimestamp.textContent = new Date().toLocaleTimeString();
      }

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
// 6. Table Controller
// ============================================================================

const TableController = {
  init() {
    this.tableBody = document.getElementById('tableBody');
    this.emptyState = document.getElementById('tableEmptyState');
    this.recordCount = document.getElementById('tableRecordCount');
    this.searchInput = document.getElementById('tableSearch');
    this.clearSearchBtn = document.getElementById('btnClearSearch');
    this.categoryFilter = document.getElementById('tableCategoryFilter');
    this.tableHeaders = document.querySelectorAll('.data-table th.sortable');

    this.bindEvents();
    this.render();
  },

  bindEvents() {
    if (this.searchInput) {
      this.searchInput.addEventListener('input', (e) => {
        AppState.table.searchQuery = e.target.value.trim().toLowerCase();
        if (this.clearSearchBtn) {
          if (e.target.value) this.clearSearchBtn.classList.remove('hidden');
          else this.clearSearchBtn.classList.add('hidden');
        }
        this.render();
      });
    }

    if (this.clearSearchBtn) {
      this.clearSearchBtn.addEventListener('click', () => {
        if (this.searchInput) this.searchInput.value = '';
        AppState.table.searchQuery = '';
        this.clearSearchBtn.classList.add('hidden');
        this.render();
      });
    }

    if (this.categoryFilter) {
      this.categoryFilter.addEventListener('change', (e) => {
        AppState.table.categoryFilter = e.target.value;
        this.render();
      });
    }

    if (this.tableHeaders) {
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
    }

    const btnCsv = document.getElementById('btnExportCsv');
    if (btnCsv) btnCsv.addEventListener('click', () => this.exportCsv());

    const btnJson = document.getElementById('btnExportJson');
    if (btnJson) btnJson.addEventListener('click', () => this.exportJson());

    const btnClear = document.getElementById('btnClearHistory');
    if (btnClear) {
      btnClear.addEventListener('click', () => {
        if (AppState.submissions.length === 0) {
          ToastService.show('Table is empty', 'No records to clear', 'info', 2000);
          return;
        }
        if (confirm('Clear all submitted records from your local table?')) {
          StorageManager.clearAll();
          this.render();
          MetricsController.render();
          ToastService.show('Table Cleared', 'All submissions removed', 'warning', 3000);
        }
      });
    }
  },

  updateSortHeaderStyles() {
    if (!this.tableHeaders) return;
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

    if (AppState.table.categoryFilter !== 'ALL') {
      items = items.filter(item => (item.category || '').toLowerCase() === AppState.table.categoryFilter.toLowerCase());
    }

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
    if (!this.tableBody) return;
    const items = this.getFilteredAndSortedData();
    if (this.recordCount) {
      this.recordCount.textContent = `${items.length} ${items.length === 1 ? 'record' : 'records'}`;
    }

    if (items.length === 0) {
      this.tableBody.innerHTML = '';
      if (this.emptyState) this.emptyState.classList.remove('hidden');
      return;
    }

    if (this.emptyState) this.emptyState.classList.add('hidden');

    let html = '';
    items.forEach((item, index) => {
      const dateFormatted = new Date(item.timestamp).toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });

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
          <td class="cell-price">${this.escapeHtml(String(item.price))}</td>
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
    this.attachRowEvents(items);
  },

  attachRowEvents(currentItems) {
    if (!this.tableBody) return;
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

    this.tableBody.querySelectorAll('.btn-copy-row').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-index'), 10);
        const item = currentItems[idx];
        if (item) {
          navigator.clipboard.writeText(JSON.stringify(item.rawResponse || item, null, 2)).then(() => {
            ToastService.show('Copied!', 'JSON payload copied to clipboard', 'info', 2000);
          });
        }
      });
    });

    this.tableBody.querySelectorAll('.btn-delete-row').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        AppState.submissions = AppState.submissions.filter(s => String(s.id) !== String(id));
        StorageManager.saveSubmissions();
        this.render();
        MetricsController.render();
        ToastService.show('Deleted', `Record #${id} removed`, 'info', 2000);
      });
    });
  },

  exportCsv() {
    if (AppState.submissions.length === 0) {
      ToastService.show('Export Empty', 'No records to export', 'warning', 2000);
      return;
    }

    const headers = ['ID', 'Timestamp', 'API Source', 'Title', 'Category', 'User ID', 'Author/Tag', 'Description', 'Status Code', 'Latency (ms)'];
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
    link.setAttribute('download', `api_records_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    ToastService.show('CSV Exported', 'Downloaded submissions spreadsheet', 'success', 2500);
  },

  exportJson() {
    if (AppState.submissions.length === 0) {
      ToastService.show('Export Empty', 'No records to export', 'warning', 2000);
      return;
    }

    const jsonStr = JSON.stringify(AppState.submissions, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `api_records_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    ToastService.show('JSON Exported', 'Downloaded submissions JSON', 'success', 2500);
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
  render() {
    const statTotalRequests = document.getElementById('statTotalRequests');
    const statSuccessRate = document.getElementById('statSuccessRate');
    const statAvgLatency = document.getElementById('statAvgLatency');
    const statTotalRecords = document.getElementById('statTotalRecords');

    const { totalRequests, successfulRequests, totalLatencyMs } = AppState.metrics;
    
    if (statTotalRequests) statTotalRequests.textContent = totalRequests;
    
    const rate = totalRequests > 0 ? Math.round((successfulRequests / totalRequests) * 100) : 100;
    if (statSuccessRate) statSuccessRate.textContent = `${rate}%`;

    const avgLatency = successfulRequests > 0 ? Math.round(totalLatencyMs / successfulRequests) : 0;
    if (statAvgLatency) statAvgLatency.textContent = `${avgLatency} ms`;

    if (statTotalRecords) statTotalRecords.textContent = AppState.submissions.length;
  }
};

// ============================================================================
// 8. Modals & Theme Controller
// ============================================================================

const ModalController = {
  init() {
    this.responseModal = document.getElementById('responseModal');
    this.modalTitle = document.getElementById('modalTitle');
    this.modalJsonContent = document.getElementById('modalJsonContent');
    this.modalStatusCode = document.getElementById('modalStatusCode');
    this.modalLatency = document.getElementById('modalLatency');
    this.modalApiSource = document.getElementById('modalApiSource');
    this.btnCopyModalJson = document.getElementById('btnCopyModalJson');

    this.guideModal = document.getElementById('guideModal');

    const btnCloseModal = document.getElementById('btnCloseModal');
    const btnCloseModalBottom = document.getElementById('btnCloseModalBottom');
    if (btnCloseModal) btnCloseModal.addEventListener('click', () => this.closeResponseModal());
    if (btnCloseModalBottom) btnCloseModalBottom.addEventListener('click', () => this.closeResponseModal());

    const guideBtn = document.getElementById('guideBtn');
    const btnCloseGuide = document.getElementById('btnCloseGuideModal');
    const btnCloseGuideBottom = document.getElementById('btnCloseGuideBottom');
    if (guideBtn) guideBtn.addEventListener('click', () => this.openGuideModal());
    if (btnCloseGuide) btnCloseGuide.addEventListener('click', () => this.closeGuideModal());
    if (btnCloseGuideBottom) btnCloseGuideBottom.addEventListener('click', () => this.closeGuideModal());

    if (this.btnCopyModalJson) {
      this.btnCopyModalJson.addEventListener('click', () => {
        if (this.modalJsonContent) {
          navigator.clipboard.writeText(this.modalJsonContent.textContent).then(() => {
            ToastService.show('Copied!', 'JSON payload copied to clipboard', 'info', 2000);
          });
        }
      });
    }

    [this.responseModal, this.guideModal].filter(Boolean).forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.closeResponseModal();
          this.closeGuideModal();
        }
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeResponseModal();
        this.closeGuideModal();
      }
    });
  },

  openResponseModal(data, title = 'API Response Inspector', statusCode = 201, latency = 0, source = 'REST API') {
    if (!this.responseModal) return;
    if (this.modalTitle) this.modalTitle.textContent = title;
    if (this.modalJsonContent) this.modalJsonContent.textContent = JSON.stringify(data, null, 2);
    if (this.modalStatusCode) this.modalStatusCode.textContent = `${statusCode} OK`;
    if (this.modalLatency) this.modalLatency.textContent = `${latency} ms`;
    if (this.modalApiSource) this.modalApiSource.textContent = source;
    this.responseModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  },

  closeResponseModal() {
    if (this.responseModal) this.responseModal.classList.add('hidden');
    document.body.style.overflow = '';
  },

  openGuideModal() {
    if (this.guideModal) this.guideModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  },

  closeGuideModal() {
    if (this.guideModal) this.guideModal.classList.add('hidden');
    document.body.style.overflow = '';
  }
};

const ThemeController = {
  init() {
    const toggleBtn = document.getElementById('themeToggleBtn');
    if (!toggleBtn) return;
    toggleBtn.addEventListener('click', () => {
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

function bootstrapApp() {
  StorageManager.init();
  ThemeController.init();
  ModalController.init();
  FormController.init();
  TableController.init();
  MetricsController.render();

  setTimeout(() => {
    ToastService.show('NovaPost Ready', 'Connected to public POST REST API.', 'info', 3000);
  }, 500);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrapApp);
} else {
  bootstrapApp();
}
