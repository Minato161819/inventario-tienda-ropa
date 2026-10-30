'use strict';

const STORAGE_KEY = 'schoolstock_database_v1';
const CATEGORY_COLORS = ['#5279ed', '#18a477', '#e3a13a', '#8b6bd6', '#e16f80', '#3c9eb3', '#94a0b4'];
const PAGE_META = {
  dashboard: { title: 'Panel general', eyebrow: 'RESUMEN' },
  inventario: { title: 'Inventario', eyebrow: 'RECURSOS' },
  movimientos: { title: 'Movimientos', eyebrow: 'TRAZABILIDAD' },
  reportes: { title: 'Reportes', eyebrow: 'ANÁLISIS' }
};

const seedData = {
  items: [
    { id: 'ART-001', name: 'Computador portátil Lenovo', category: 'Tecnología', location: 'Sala de informática', quantity: 18, minStock: 5, unit: 'unidades', condition: 'Bueno', description: 'Portátiles para uso académico', updatedAt: '2026-10-28T09:00:00' },
    { id: 'ART-002', name: 'Video beam Epson', category: 'Tecnología', location: 'Almacén', quantity: 3, minStock: 2, unit: 'unidades', condition: 'Bueno', description: 'Proyectores audiovisuales', updatedAt: '2026-10-26T11:30:00' },
    { id: 'ART-003', name: 'Sillas universitarias', category: 'Mobiliario', location: 'Salón de clase', quantity: 42, minStock: 10, unit: 'unidades', condition: 'Regular', description: 'Sillas para estudiantes', updatedAt: '2026-10-24T08:15:00' },
    { id: 'ART-004', name: 'Balones de fútbol', category: 'Deportes', location: 'Patio / Cancha', quantity: 4, minStock: 6, unit: 'unidades', condition: 'Bueno', description: 'Balones tamaño 5', updatedAt: '2026-10-27T14:20:00' },
    { id: 'ART-005', name: 'Microscopio monocular', category: 'Laboratorio', location: 'Laboratorio', quantity: 8, minStock: 3, unit: 'unidades', condition: 'Bueno', description: 'Equipo de ciencias naturales', updatedAt: '2026-10-20T10:00:00' },
    { id: 'ART-006', name: 'Libros de ciencias', category: 'Biblioteca', location: 'Biblioteca', quantity: 2, minStock: 8, unit: 'libros', condition: 'Bueno', description: 'Colección de ciencias naturales', updatedAt: '2026-10-29T12:00:00' },
    { id: 'ART-007', name: 'Resmas de papel carta', category: 'Papelería', location: 'Oficina administrativa', quantity: 0, minStock: 5, unit: 'paquetes', condition: 'Bueno', description: 'Papel para impresión', updatedAt: '2026-10-29T15:45:00' },
    { id: 'ART-008', name: 'Mesas de laboratorio', category: 'Mobiliario', location: 'Laboratorio', quantity: 12, minStock: 4, unit: 'unidades', condition: 'Bueno', description: 'Mesas de trabajo', updatedAt: '2026-10-18T09:30:00' },
    { id: 'ART-009', name: 'Teclados USB', category: 'Tecnología', location: 'Sala de informática', quantity: 7, minStock: 5, unit: 'unidades', condition: 'Regular', description: 'Periféricos de computador', updatedAt: '2026-10-25T16:00:00' }
  ],
  movements: [
    { id: 'MOV-001', itemId: 'ART-001', itemName: 'Computador portátil Lenovo', type: 'Entrada', quantity: 5, date: '2026-10-28T09:00:00', responsible: 'Laura Gómez', note: 'Compra de equipos para laboratorio' },
    { id: 'MOV-002', itemId: 'ART-004', itemName: 'Balones de fútbol', type: 'Salida', quantity: 2, date: '2026-10-27T14:20:00', responsible: 'Carlos Rojas', note: 'Préstamo para jornada deportiva' },
    { id: 'MOV-003', itemId: 'ART-006', itemName: 'Libros de ciencias', type: 'Salida', quantity: 3, date: '2026-10-29T12:00:00', responsible: 'Marta Díaz', note: 'Entrega a biblioteca de aula' },
    { id: 'MOV-004', itemId: 'ART-007', itemName: 'Resmas de papel carta', type: 'Salida', quantity: 5, date: '2026-10-29T15:45:00', responsible: 'Andrés Ruiz', note: 'Consumo de oficina' },
    { id: 'MOV-005', itemId: 'ART-002', itemName: 'Video beam Epson', type: 'Entrada', quantity: 1, date: '2026-10-26T11:30:00', responsible: 'Laura Gómez', note: 'Devolución de préstamo' }
  ]
};

let database = loadDatabase();
let currentPage = 'dashboard';
let itemModalInstance;
let movementModalInstance;
let toastInstance;

function loadDatabase() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed.items) && Array.isArray(parsed.movements)) return parsed;
    }
  } catch (error) {
    console.warn('No fue posible leer los datos guardados. Se cargarán datos de ejemplo.', error);
  }
  return structuredClone(seedData);
}

function saveDatabase() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(database));
  } catch (error) {
    console.error('No fue posible guardar los datos:', error);
    showToast('No se pudieron guardar los cambios en este navegador.');
  }
}

function escapeHTML(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
}

function formatNumber(value) {
  return new Intl.NumberFormat('es-CO').format(Number(value) || 0);
}

function formatDate(value, includeTime = false) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  const options = includeTime
    ? { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }
    : { day: '2-digit', month: 'short', year: 'numeric' };
  return new Intl.DateTimeFormat('es-CO', options).format(date);
}

function stockStatus(item) {
  if (Number(item.quantity) <= 0) return 'zero';
  if (Number(item.quantity) <= Number(item.minStock)) return 'low';
  return 'normal';
}

function statusBadge(item) {
  const status = stockStatus(item);
  const labels = { normal: 'Stock normal', low: 'Stock bajo', zero: 'Agotado' };
  return `<span class="status-badge status-${status}">${labels[status]}</span>`;
}

function showToast(message) {
  const toastEl = document.getElementById('appToast');
  document.getElementById('toastMessage').textContent = message;
  if (toastInstance) toastInstance.show();
  else if (window.bootstrap) {
    toastInstance = new bootstrap.Toast(toastEl, { delay: 2800 });
    toastInstance.show();
  }
}

function updateCommonUI() {
  document.getElementById('navItemCount').textContent = database.items.length;
  document.getElementById('todayLabel').textContent = new Intl.DateTimeFormat('es-CO', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }).format(new Date());
}

function navigateTo(page) {
  if (!PAGE_META[page]) return;
  currentPage = page;
  document.querySelectorAll('.page-view').forEach(view => {
    const active = view.id === `page-${page}`;
    view.classList.toggle('active', active);
    view.hidden = !active;
  });
  document.querySelectorAll('.app-nav .nav-link').forEach(link => link.classList.toggle('active', link.dataset.page === page));
  document.getElementById('pageTitle').textContent = PAGE_META[page].title;
  document.getElementById('pageEyebrow').textContent = PAGE_META[page].eyebrow;
  document.getElementById('sidebar').classList.remove('open');
  renderCurrentPage();
}

function renderCurrentPage() {
  updateCommonUI();
  if (currentPage === 'dashboard') renderDashboard();
  if (currentPage === 'inventario') renderInventory();
  if (currentPage === 'movimientos') renderMovements();
  if (currentPage === 'reportes') renderReports();
}

function renderDashboard() {
  const totalUnits = database.items.reduce((sum, item) => sum + Number(item.quantity), 0);
  const lowCount = database.items.filter(item => stockStatus(item) !== 'normal').length;
  const categories = [...new Set(database.items.map(item => item.category))].length;
  const stats = [
    { label: 'Artículos registrados', value: database.items.length, foot: 'Referencias en inventario', icon: '▤', color: '' },
    { label: 'Unidades disponibles', value: formatNumber(totalUnits), foot: 'Existencias actuales', icon: '▣', color: 'green' },
    { label: 'Stock por revisar', value: lowCount, foot: 'Bajo mínimo o agotado', icon: '⚑', color: 'orange' },
    { label: 'Categorías activas', value: categories, foot: 'Áreas de clasificación', icon: '◫', color: 'red' }
  ];
  document.getElementById('dashboardStats').innerHTML = stats.map(stat => `
    <div class="col-6 col-xl-3"><div class="stat-card ${stat.color}"><div class="stat-top"><span class="stat-label">${stat.label}</span><span class="stat-icon">${stat.icon}</span></div><div class="stat-number">${stat.value}</div><div class="stat-foot">${stat.foot}</div></div></div>`).join('');

  const lowItems = database.items.filter(item => stockStatus(item) !== 'normal').sort((a, b) => a.quantity - b.quantity).slice(0, 5);
  document.getElementById('lowStockTable').innerHTML = lowItems.length ? `<div class="table-responsive"><table class="table"><thead><tr><th>Artículo</th><th>Existencia</th><th>Estado</th></tr></thead><tbody>${lowItems.map(item => `<tr><td class="item-name">${escapeHTML(item.name)}<span class="item-sub">${escapeHTML(item.category)}</span></td><td>${formatNumber(item.quantity)} ${escapeHTML(item.unit)}</td><td>${statusBadge(item)}</td></tr>`).join('')}</tbody></table></div>` : '<div class="empty-state"><strong>¡Todo en orden!</strong>No hay artículos con stock bajo.</div>';

  const categoryTotals = getCategoryTotals();
  const maxCategory = Math.max(1, ...categoryTotals.map(item => item.quantity));
  document.getElementById('categorySummary').innerHTML = categoryTotals.length ? categoryTotals.map((entry, index) => `<div><div class="category-line-head"><strong>${escapeHTML(entry.category)}</strong><span>${formatNumber(entry.quantity)} unidades</span></div><div class="progress"><div class="progress-bar" style="width:${(entry.quantity / maxCategory) * 100}%;background:${CATEGORY_COLORS[index % CATEGORY_COLORS.length]}"></div></div></div>`).join('') : '<div class="empty-state">Aún no hay categorías registradas.</div>';

  const recent = [...database.movements].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
  document.getElementById('recentMovements').innerHTML = renderMovementTable(recent, false);
}

function getCategoryTotals() {
  const totals = new Map();
  database.items.forEach(item => totals.set(item.category, (totals.get(item.category) || 0) + Number(item.quantity)));
  return [...totals.entries()].map(([category, quantity]) => ({ category, quantity })).sort((a, b) => b.quantity - a.quantity);
}

function renderInventory() {
  const search = (document.getElementById('inventorySearch')?.value || '').trim().toLowerCase();
  const category = document.getElementById('categoryFilter')?.value || '';
  const stock = document.getElementById('stockFilter')?.value || '';
  const categories = [...new Set(database.items.map(item => item.category))].sort((a, b) => a.localeCompare(b, 'es'));
  const categorySelect = document.getElementById('categoryFilter');
  const selectedCategory = categorySelect.value;
  categorySelect.innerHTML = '<option value="">Todas las categorías</option>' + categories.map(value => `<option value="${escapeHTML(value)}">${escapeHTML(value)}</option>`).join('');
  if (categories.includes(selectedCategory)) categorySelect.value = selectedCategory;

  const filtered = database.items.filter(item => {
    const text = `${item.name} ${item.id} ${item.location} ${item.category}`.toLowerCase();
    return (!search || text.includes(search)) && (!category || item.category === category) && (!stock || stockStatus(item) === stock);
  }).sort((a, b) => a.name.localeCompare(b.name, 'es'));

  document.getElementById('inventoryTable').innerHTML = filtered.length ? `<div class="table-responsive"><table class="table"><thead><tr><th>Artículo</th><th>Categoría</th><th>Ubicación</th><th>Existencia</th><th>Estado</th><th>Condición</th><th class="text-end">Acciones</th></tr></thead><tbody>${filtered.map(item => `<tr>
    <td class="item-name">${escapeHTML(item.name)}<span class="item-sub">${escapeHTML(item.id)}</span></td><td>${escapeHTML(item.category)}</td><td>${escapeHTML(item.location)}</td><td><strong>${formatNumber(item.quantity)}</strong> <span class="text-muted">${escapeHTML(item.unit)}</span><span class="item-sub">Mínimo: ${formatNumber(item.minStock)}</span></td><td>${statusBadge(item)}</td><td>${conditionBadge(item.condition)}</td><td class="text-end"><button class="action-btn" title="Editar artículo" aria-label="Editar artículo" data-action="edit-item" data-id="${escapeHTML(item.id)}">✎</button><button class="action-btn delete" title="Eliminar artículo" aria-label="Eliminar artículo" data-action="delete-item" data-id="${escapeHTML(item.id)}">×</button></td></tr>`).join('')}</tbody></table></div>` : '<div class="empty-state"><strong>No se encontraron artículos</strong>Prueba cambiando los filtros o registra un nuevo recurso.</div>';
  document.getElementById('inventoryCount').textContent = `Mostrando ${filtered.length} de ${database.items.length} artículos`;
}

function conditionBadge(condition) {
  const styles = { Bueno: 'status-normal', Regular: 'status-low', 'En mantenimiento': 'status-neutral', Dañado: 'status-zero' };
  return `<span class="status-badge ${styles[condition] || 'status-neutral'}">${escapeHTML(condition)}</span>`;
}

function renderMovementTable(movements, withActions = true) {
  if (!movements.length) return '<div class="empty-state"><strong>No hay movimientos registrados</strong>Registra una entrada o salida para ver la actividad aquí.</div>';
  return `<div class="table-responsive"><table class="table"><thead><tr><th>Movimiento</th><th>Artículo</th><th>Cantidad</th><th>Responsable</th><th>Fecha</th>${withActions ? '<th class="text-end">Código</th>' : ''}</tr></thead><tbody>${movements.map(movement => `<tr>
    <td><span class="movement-dot ${movement.type === 'Entrada' ? 'in' : 'out'}">${movement.type === 'Entrada' ? '↓' : '↑'}</span><span class="movement-type ${movement.type === 'Entrada' ? 'type-in' : 'type-out'}">${escapeHTML(movement.type)}</span></td>
    <td class="item-name">${escapeHTML(movement.itemName)}<span class="item-sub">${escapeHTML(movement.note || 'Sin observación')}</span></td>
    <td><strong>${movement.type === 'Entrada' ? '+' : '−'}${formatNumber(movement.quantity)}</strong></td><td>${escapeHTML(movement.responsible || '—')}</td><td>${formatDate(movement.date, true)}</td>${withActions ? `<td class="text-end"><span class="item-sub">${escapeHTML(movement.id)}</span></td>` : ''}</tr>`).join('')}</tbody></table></div>`;
}

function renderMovements() {
  const search = (document.getElementById('movementSearch')?.value || '').trim().toLowerCase();
  const type = document.getElementById('movementTypeFilter')?.value || '';
  const movements = [...database.movements].sort((a, b) => new Date(b.date) - new Date(a.date));
  const filtered = movements.filter(item => `${item.itemName} ${item.responsible} ${item.id}`.toLowerCase().includes(search) && (!type || item.type === type));
  const entries = movements.filter(item => item.type === 'Entrada').reduce((sum, item) => sum + Number(item.quantity), 0);
  const exits = movements.filter(item => item.type === 'Salida').reduce((sum, item) => sum + Number(item.quantity), 0);
  document.getElementById('movementStats').innerHTML = `
    <div class="col-md-4"><div class="stat-card green"><div class="stat-top"><span class="stat-label">Unidades de entrada</span><span class="stat-icon">↓</span></div><div class="stat-number">${formatNumber(entries)}</div><div class="stat-foot">Acumulado de movimientos</div></div></div>
    <div class="col-md-4"><div class="stat-card red"><div class="stat-top"><span class="stat-label">Unidades de salida</span><span class="stat-icon">↑</span></div><div class="stat-number">${formatNumber(exits)}</div><div class="stat-foot">Acumulado de movimientos</div></div></div>
    <div class="col-md-4"><div class="stat-card"><div class="stat-top"><span class="stat-label">Movimientos registrados</span><span class="stat-icon">⇄</span></div><div class="stat-number">${movements.length}</div><div class="stat-foot">Entradas y salidas</div></div></div>`;
  document.getElementById('movementsTable').innerHTML = renderMovementTable(filtered, true);
  document.getElementById('movementCount').textContent = `Mostrando ${filtered.length} de ${movements.length} movimientos`;
}

function renderReports() {
  const totalUnits = database.items.reduce((sum, item) => sum + Number(item.quantity), 0);
  const low = database.items.filter(item => stockStatus(item) === 'low').length;
  const zero = database.items.filter(item => stockStatus(item) === 'zero').length;
  const normal = database.items.filter(item => stockStatus(item) === 'normal').length;
  document.getElementById('reportStats').innerHTML = `
    <div class="col-sm-6 col-xl-3"><div class="stat-card"><div class="stat-label">Referencias</div><div class="stat-number">${database.items.length}</div><div class="stat-foot">Artículos diferentes</div></div></div>
    <div class="col-sm-6 col-xl-3"><div class="stat-card green"><div class="stat-label">Unidades actuales</div><div class="stat-number">${formatNumber(totalUnits)}</div><div class="stat-foot">En todas las ubicaciones</div></div></div>
    <div class="col-sm-6 col-xl-3"><div class="stat-card orange"><div class="stat-label">Stock bajo</div><div class="stat-number">${low}</div><div class="stat-foot">Requieren reposición</div></div></div>
    <div class="col-sm-6 col-xl-3"><div class="stat-card red"><div class="stat-label">Agotados</div><div class="stat-number">${zero}</div><div class="stat-foot">Sin unidades disponibles</div></div></div>`;

  const totals = getCategoryTotals();
  document.getElementById('reportCategories').innerHTML = totals.length ? totals.map((entry, index) => `<div class="category-report-row"><div class="category-line-head"><strong>${escapeHTML(entry.category)}</strong><span>${formatNumber(entry.quantity)} unidades</span></div><div class="progress"><div class="progress-bar" style="width:${totalUnits ? (entry.quantity / totalUnits) * 100 : 0}%;background:${CATEGORY_COLORS[index % CATEGORY_COLORS.length]}"></div></div></div>`).join('') : '<div class="empty-state">No hay datos para mostrar.</div>';
  document.getElementById('stockHealth').innerHTML = `
    <div class="health-row"><span><span class="status-badge status-normal">Stock normal</span></span><strong>${normal}</strong></div>
    <div class="health-row"><span><span class="status-badge status-low">Stock bajo</span></span><strong>${low}</strong></div>
    <div class="health-row"><span><span class="status-badge status-zero">Agotado</span></span><strong>${zero}</strong></div>
    <div class="health-row"><span class="muted">Total de artículos</span><strong>${database.items.length}</strong></div>`;
}

function nextId(prefix, records) {
  const max = records.reduce((highest, record) => {
    const number = Number(String(record.id).replace(`${prefix}-`, ''));
    return Number.isFinite(number) ? Math.max(highest, number) : highest;
  }, 0);
  return `${prefix}-${String(max + 1).padStart(3, '0')}`;
}

function openNewItemModal() {
  document.getElementById('itemForm').reset();
  document.getElementById('itemId').value = '';
  document.getElementById('itemCode').value = '';
  document.getElementById('itemQuantity').disabled = false;
  document.getElementById('itemModalTitle').textContent = 'Registrar artículo';
  document.getElementById('itemFormHint').textContent = 'Los campos con * son obligatorios. La cantidad inicial quedará registrada como una entrada.';
}

function openEditItemModal(id) {
  const item = database.items.find(record => record.id === id);
  if (!item) return;
  document.getElementById('itemForm').reset();
  document.getElementById('itemId').value = item.id;
  document.getElementById('itemName').value = item.name;
  document.getElementById('itemCode').value = item.id;
  document.getElementById('itemCategory').value = item.category;
  document.getElementById('itemLocation').value = item.location;
  document.getElementById('itemQuantity').value = item.quantity;
  document.getElementById('itemQuantity').disabled = true;
  document.getElementById('itemMinimum').value = item.minStock;
  document.getElementById('itemUnit').value = item.unit;
  document.getElementById('itemCondition').value = item.condition;
  document.getElementById('itemDescription').value = item.description || '';
  document.getElementById('itemModalTitle').textContent = 'Editar artículo';
  document.getElementById('itemFormHint').textContent = 'Para cambiar las existencias, registra una entrada o salida desde el módulo Movimientos. Así se conserva el historial.';
  itemModalInstance.show();
}

function saveItem(event) {
  event.preventDefault();
  const id = document.getElementById('itemId').value;
  const existing = id ? database.items.find(item => item.id === id) : null;
  const codeInput = document.getElementById('itemCode').value.trim();
  const itemId = existing ? existing.id : (codeInput || nextId('ART', database.items));
  if (!existing && database.items.some(item => item.id.toLowerCase() === itemId.toLowerCase())) {
    showToast('Ese código ya está registrado. Usa otro código.');
    return;
  }
  const quantity = existing ? existing.quantity : Number(document.getElementById('itemQuantity').value);
  const item = {
    id: itemId,
    name: document.getElementById('itemName').value.trim(),
    category: document.getElementById('itemCategory').value,
    location: document.getElementById('itemLocation').value,
    quantity,
    minStock: Number(document.getElementById('itemMinimum').value),
    unit: document.getElementById('itemUnit').value,
    condition: document.getElementById('itemCondition').value,
    description: document.getElementById('itemDescription').value.trim(),
    updatedAt: new Date().toISOString()
  };
  if (existing) {
    Object.assign(existing, item);
    database.movements.forEach(movement => { if (movement.itemId === existing.id) movement.itemName = existing.name; });
    showToast('Artículo actualizado correctamente.');
  } else {
    database.items.push(item);
    if (quantity > 0) database.movements.push({ id: nextId('MOV', database.movements), itemId: item.id, itemName: item.name, type: 'Entrada', quantity, date: new Date().toISOString(), responsible: 'Administrador', note: 'Registro inicial del artículo' });
    showToast('Artículo registrado correctamente.');
  }
  saveDatabase();
  itemModalInstance.hide();
  renderCurrentPage();
}

function deleteItem(id) {
  const item = database.items.find(record => record.id === id);
  if (!item) return;
  const confirmed = window.confirm(`¿Deseas eliminar "${item.name}" del inventario? El historial de movimientos se conservará.`);
  if (!confirmed) return;
  database.items = database.items.filter(record => record.id !== id);
  saveDatabase();
  renderCurrentPage();
  showToast('Artículo eliminado del inventario.');
}

function populateMovementItems() {
  const select = document.getElementById('movementItem');
  const current = select.value;
  select.innerHTML = '<option value="">Selecciona un artículo</option>' + [...database.items].sort((a, b) => a.name.localeCompare(b.name, 'es')).map(item => `<option value="${escapeHTML(item.id)}">${escapeHTML(item.name)} — ${formatNumber(item.quantity)} ${escapeHTML(item.unit)}</option>`).join('');
  if (database.items.some(item => item.id === current)) select.value = current;
  updateMovementAvailable();
}

function updateMovementAvailable() {
  const item = database.items.find(record => record.id === document.getElementById('movementItem').value);
  document.getElementById('movementAvailable').textContent = item ? `Existencia actual: ${formatNumber(item.quantity)} ${item.unit}` : 'Selecciona un artículo para consultar sus existencias.';
}

function saveMovement(event) {
  event.preventDefault();
  const item = database.items.find(record => record.id === document.getElementById('movementItem').value);
  const type = document.getElementById('movementType').value;
  const quantity = Number(document.getElementById('movementQuantity').value);
  const responsible = document.getElementById('movementResponsible').value.trim();
  if (!item) return showToast('Selecciona un artículo válido.');
  if (!Number.isInteger(quantity) || quantity <= 0) return showToast('La cantidad debe ser un número entero mayor que cero.');
  if (type === 'Salida' && quantity > item.quantity) return showToast(`No hay existencias suficientes. Disponible: ${item.quantity} ${item.unit}.`);
  item.quantity += type === 'Entrada' ? quantity : -quantity;
  item.updatedAt = new Date().toISOString();
  database.movements.push({ id: nextId('MOV', database.movements), itemId: item.id, itemName: item.name, type, quantity, date: new Date().toISOString(), responsible, note: document.getElementById('movementNote').value.trim() });
  saveDatabase();
  movementModalInstance.hide();
  document.getElementById('movementForm').reset();
  renderCurrentPage();
  showToast(`${type} registrada correctamente. Nueva existencia: ${item.quantity} ${item.unit}.`);
}

function csvCell(value) {
  const text = String(value ?? '');
  return `"${text.replace(/"/g, '""')}"`;
}

function downloadCSV(filename, rows) {
  const csv = '\uFEFF' + rows.map(row => row.map(csvCell).join(';')).join('\r\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
  showToast('Archivo CSV descargado correctamente.');
}

function exportItems() {
  const rows = [['Código', 'Artículo', 'Categoría', 'Ubicación', 'Cantidad', 'Unidad', 'Stock mínimo', 'Estado de stock', 'Condición', 'Descripción']];
  database.items.forEach(item => rows.push([item.id, item.name, item.category, item.location, item.quantity, item.unit, item.minStock, stockStatus(item), item.condition, item.description]));
  downloadCSV('schoolstock-inventario.csv', rows);
}

function exportMovements() {
  const rows = [['Código movimiento', 'Código artículo', 'Artículo', 'Tipo', 'Cantidad', 'Responsable', 'Fecha', 'Observación']];
  [...database.movements].sort((a, b) => new Date(b.date) - new Date(a.date)).forEach(item => rows.push([item.id, item.itemId, item.itemName, item.type, item.quantity, item.responsible, formatDate(item.date, true), item.note]));
  downloadCSV('schoolstock-movimientos.csv', rows);
}

function bindEvents() {
  document.addEventListener('click', event => {
    const nav = event.target.closest('[data-page]');
    if (nav) {
      event.preventDefault();
      navigateTo(nav.dataset.page);
      return;
    }
    const action = event.target.closest('[data-action]');
    if (action) {
      if (action.dataset.action === 'edit-item') openEditItemModal(action.dataset.id);
      if (action.dataset.action === 'delete-item') deleteItem(action.dataset.id);
    }
  });
  document.getElementById('itemForm').addEventListener('submit', saveItem);
  document.getElementById('movementForm').addEventListener('submit', saveMovement);
  document.getElementById('itemModal').addEventListener('show.bs.modal', event => {
    if (event.relatedTarget?.id === 'quickAddItem' || event.relatedTarget?.id === 'addItemButton') openNewItemModal();
  });
  document.getElementById('movementModal').addEventListener('show.bs.modal', () => {
    document.getElementById('movementForm').reset();
    populateMovementItems();
  });
  document.getElementById('movementItem').addEventListener('change', updateMovementAvailable);
  document.getElementById('inventorySearch').addEventListener('input', renderInventory);
  document.getElementById('categoryFilter').addEventListener('change', renderInventory);
  document.getElementById('stockFilter').addEventListener('change', renderInventory);
  document.getElementById('movementSearch').addEventListener('input', renderMovements);
  document.getElementById('movementTypeFilter').addEventListener('change', renderMovements);
  document.getElementById('exportItemsButton').addEventListener('click', exportItems);
  document.getElementById('exportMovementsButton').addEventListener('click', exportMovements);
  document.getElementById('exportFullButton').addEventListener('click', exportItems);
  document.getElementById('sidebarToggle').addEventListener('click', () => document.getElementById('sidebar').classList.toggle('open'));
  document.addEventListener('click', event => {
    if (window.innerWidth < 992 && document.getElementById('sidebar').classList.contains('open') && !event.target.closest('#sidebar') && !event.target.closest('#sidebarToggle')) {
      document.getElementById('sidebar').classList.remove('open');
    }
  });
  window.addEventListener('hashchange', () => {
    const page = window.location.hash.replace('#', '') || 'dashboard';
    if (PAGE_META[page]) navigateTo(page);
  });
}

function init() {
  if (!window.bootstrap) {
    alert('No se pudo cargar Bootstrap. Verifica tu conexión a internet y vuelve a abrir la página.');
    return;
  }
  itemModalInstance = new bootstrap.Modal(document.getElementById('itemModal'));
  movementModalInstance = new bootstrap.Modal(document.getElementById('movementModal'));
  bindEvents();
  const initialPage = window.location.hash.replace('#', '') || 'dashboard';
  navigateTo(PAGE_META[initialPage] ? initialPage : 'dashboard');
}

document.addEventListener('DOMContentLoaded', init);
