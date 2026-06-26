import axios from 'axios';

const BASE = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/stock`;

const api = axios.create({ baseURL: BASE });

// ─── Generic CRUD helpers ─────────────────────────────────────────────────────
const crud = (path) => ({
  getAll:   ()       => api.get(path),
  getById:  (id)     => api.get(`${path}/${id}`),
  create:   (data)   => api.post(path, data),
  update:   (id, d)  => api.put(`${path}/${id}`, d),
  remove:   (id)     => api.delete(`${path}/${id}`),
});

// ─── Entity endpoints ─────────────────────────────────────────────────────────
export const stockEntriesApi      = crud('/stock-entries');
export const purchaseReceiptsApi  = crud('/purchase-receipts');
export const deliveryNotesApi     = crud('/delivery-notes');
export const materialRequestsApi  = crud('/material-requests');
export const pickListsApi         = crud('/pick-lists');
export const warehousesApi        = crud('/warehouses');
export const itemsApi             = crud('/items');
export const itemGroupsApi        = crud('/item-groups');
export const uomsApi              = crud('/uoms');
export const serialNosApi         = crud('/serial-nos');
export const batchesApi           = crud('/batches');
export const qualityInspectionsApi = crud('/quality-inspections');

// ─── Dashboard aggregates (derived from entity data) ─────────────────────────
// These aggregate on the frontend since the backend doesn't have a /dashboard endpoint.
export const fetchDashboardData = async () => {
  try {
    const [itemsRes, warehousesRes] = await Promise.all([
      api.get('/items'),
      api.get('/warehouses'),
    ]);
    
    const items = Array.isArray(itemsRes?.data) ? itemsRes.data : [];
    const warehouses = Array.isArray(warehousesRes?.data) ? warehousesRes.data : [];

    const totalStockValue = warehouses.reduce(
      (sum, w) => sum + (parseFloat(w.stockValue) || 0), 0
    );

    const warehouseChartData = warehouses.map(w => ({
      warehouse: w.name,
      value: parseFloat(w.stockValue) || 0,
    }));

    return {
      totalItems:      items.length,
      totalWarehouses: warehouses.length,
      totalStockValue,
      warehouseChartData,
      items,
      warehouses,
    };
  } catch (error) {
    console.error("Dashboard fetch error:", error);
    return {
      totalItems: 0,
      totalWarehouses: 0,
      totalStockValue: 0,
      warehouseChartData: [],
      items: [],
      warehouses: [],
    };
  }
};

