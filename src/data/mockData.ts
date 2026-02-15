export const branches = [
  { id: "BR001", name: "Mumbai Central" },
  { id: "BR002", name: "Delhi NCR" },
  { id: "BR003", name: "Bangalore South" },
  { id: "BR004", name: "Chennai Port" },
  { id: "BR005", name: "Kolkata East" },
];

export const predefinedChargeTypes = [
  { code: "UNLOAD", name: "Unloading Charges", category: "Handling" },
  { code: "DETENTION", name: "Detention Charges", category: "Penalties" },
  { code: "DIVERSION", name: "Diversion Charges", category: "Route" },
  { code: "TOLL", name: "Toll Handling", category: "Route" },
  { code: "LOADING", name: "Loading Charges", category: "Handling" },
  { code: "MULTIPOINT", name: "Multi-Point Delivery", category: "Delivery" },
  { code: "OVERWEIGHT", name: "Overweight Penalty", category: "Penalties" },
  { code: "INSURANCE", name: "Insurance Surcharge", category: "Compliance" },
];

export type ChargeConfig = {
  chargeCode: string;
  chargeName: string;
  scope: "Company" | "Branch";
  branchId?: string;
  branchName?: string;
  granularity: "Journey" | "Load";
  rulesCount: number;
  defaultRulePresent: boolean;
  approvalEnabled: boolean;
  status: "Active" | "Inactive" | "Draft";
  lastUpdated: string;
  whoCanAdd: string[];
  provisionalAllowed: boolean;
  remarksMandatory: boolean;
  attachmentsMandatory: boolean;
};

export const mockCharges: ChargeConfig[] = [
  {
    chargeCode: "UNLOAD",
    chargeName: "Unloading Charges",
    scope: "Company",
    granularity: "Journey",
    rulesCount: 3,
    defaultRulePresent: true,
    approvalEnabled: true,
    status: "Active",
    lastUpdated: "2026-02-12T10:30:00Z",
    whoCanAdd: ["Admin", "Finance Manager"],
    provisionalAllowed: true,
    remarksMandatory: false,
    attachmentsMandatory: false,
  },
  {
    chargeCode: "DETENTION",
    chargeName: "Detention Charges",
    scope: "Company",
    granularity: "Journey",
    rulesCount: 2,
    defaultRulePresent: false,
    approvalEnabled: true,
    status: "Active",
    lastUpdated: "2026-02-10T14:15:00Z",
    whoCanAdd: ["Admin"],
    provisionalAllowed: false,
    remarksMandatory: true,
    attachmentsMandatory: false,
  },
  {
    chargeCode: "DIVERSION",
    chargeName: "Diversion Charges",
    scope: "Branch",
    branchId: "BR001",
    branchName: "Mumbai Central",
    granularity: "Load",
    rulesCount: 1,
    defaultRulePresent: true,
    approvalEnabled: false,
    status: "Active",
    lastUpdated: "2026-02-08T09:00:00Z",
    whoCanAdd: ["Admin", "Branch Manager"],
    provisionalAllowed: true,
    remarksMandatory: false,
    attachmentsMandatory: true,
  },
  {
    chargeCode: "TOLL",
    chargeName: "Toll Handling",
    scope: "Company",
    granularity: "Journey",
    rulesCount: 5,
    defaultRulePresent: true,
    approvalEnabled: false,
    status: "Active",
    lastUpdated: "2026-02-14T16:45:00Z",
    whoCanAdd: ["Admin", "Operations Head"],
    provisionalAllowed: false,
    remarksMandatory: false,
    attachmentsMandatory: false,
  },
  {
    chargeCode: "LOADING",
    chargeName: "Loading Charges",
    scope: "Branch",
    branchId: "BR002",
    branchName: "Delhi NCR",
    granularity: "Load",
    rulesCount: 0,
    defaultRulePresent: false,
    approvalEnabled: false,
    status: "Draft",
    lastUpdated: "2026-02-13T11:20:00Z",
    whoCanAdd: ["Admin"],
    provisionalAllowed: false,
    remarksMandatory: false,
    attachmentsMandatory: false,
  },
];

export type RuleConfig = {
  id: string;
  priority: number;
  alias: string;
  validityStart: string;
  validityEnd: string;
  dimensions: string;
  rateType: "Fixed" | "Per-unit" | "Slabbed" | "Slab+Overflow";
  computeOn: string;
  mgtGate: boolean;
  approvalEnabled: boolean;
  status: "Draft" | "Active" | "Expired";
};

export const mockRules: Record<string, RuleConfig[]> = {
  UNLOAD: [
    {
      id: "R001",
      priority: 1,
      alias: "Metro City Unloading",
      validityStart: "2026-01-01",
      validityEnd: "2026-12-31",
      dimensions: "Route: Metro, Vehicle: 20T+",
      rateType: "Slabbed",
      computeOn: "Weight",
      mgtGate: true,
      approvalEnabled: true,
      status: "Active",
    },
    {
      id: "R002",
      priority: 2,
      alias: "Tier-2 City Unloading",
      validityStart: "2026-01-01",
      validityEnd: "2026-06-30",
      dimensions: "Route: Tier-2, Vehicle: All",
      rateType: "Per-unit",
      computeOn: "Units",
      mgtGate: false,
      approvalEnabled: false,
      status: "Active",
    },
    {
      id: "R003",
      priority: 0,
      alias: "Default Unloading",
      validityStart: "2026-01-01",
      validityEnd: "2027-12-31",
      dimensions: "All",
      rateType: "Fixed",
      computeOn: "Distance",
      mgtGate: false,
      approvalEnabled: false,
      status: "Active",
    },
  ],
  DETENTION: [
    {
      id: "R004",
      priority: 1,
      alias: "Standard Detention",
      validityStart: "2026-01-01",
      validityEnd: "2026-12-31",
      dimensions: "Vehicle: All",
      rateType: "Slab+Overflow",
      computeOn: "Duration",
      mgtGate: false,
      approvalEnabled: true,
      status: "Active",
    },
    {
      id: "R005",
      priority: 2,
      alias: "Express Detention",
      validityStart: "2026-03-01",
      validityEnd: "2026-09-30",
      dimensions: "Movement: Express",
      rateType: "Per-unit",
      computeOn: "Duration",
      mgtGate: true,
      approvalEnabled: true,
      status: "Draft",
    },
  ],
  DIVERSION: [
    {
      id: "R006",
      priority: 0,
      alias: "Default Diversion Rate",
      validityStart: "2026-01-01",
      validityEnd: "2027-12-31",
      dimensions: "All",
      rateType: "Per-unit",
      computeOn: "Distance",
      mgtGate: false,
      approvalEnabled: false,
      status: "Active",
    },
  ],
  TOLL: [
    {
      id: "R007",
      priority: 1,
      alias: "NH Toll - North",
      validityStart: "2026-01-01",
      validityEnd: "2026-12-31",
      dimensions: "Route: NH-North",
      rateType: "Fixed",
      computeOn: "Distance",
      mgtGate: false,
      approvalEnabled: false,
      status: "Active",
    },
    {
      id: "R008",
      priority: 2,
      alias: "NH Toll - South",
      validityStart: "2026-01-01",
      validityEnd: "2026-12-31",
      dimensions: "Route: NH-South",
      rateType: "Fixed",
      computeOn: "Distance",
      mgtGate: false,
      approvalEnabled: false,
      status: "Active",
    },
    {
      id: "R009",
      priority: 3,
      alias: "Expressway Toll",
      validityStart: "2026-02-01",
      validityEnd: "2026-08-31",
      dimensions: "Route: Expressway",
      rateType: "Slabbed",
      computeOn: "Distance",
      mgtGate: false,
      approvalEnabled: false,
      status: "Active",
    },
    {
      id: "R010",
      priority: 4,
      alias: "State Highway Toll",
      validityStart: "2026-01-01",
      validityEnd: "2026-12-31",
      dimensions: "Route: SH-All",
      rateType: "Per-unit",
      computeOn: "Distance",
      mgtGate: false,
      approvalEnabled: false,
      status: "Active",
    },
    {
      id: "R011",
      priority: 0,
      alias: "Default Toll",
      validityStart: "2026-01-01",
      validityEnd: "2027-12-31",
      dimensions: "All",
      rateType: "Fixed",
      computeOn: "Distance",
      mgtGate: false,
      approvalEnabled: false,
      status: "Active",
    },
  ],
};

export const dimensionOptions = {
  route: ["NH-North", "NH-South", "Expressway", "SH-All", "Metro", "Tier-2", "Tier-3"],
  origin: ["Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", "Hyderabad", "Pune"],
  destination: ["Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", "Hyderabad", "Pune"],
  vehicleType: ["LCV (< 7.5T)", "ICV (7.5–15T)", "MCV (15–25T)", "HCV (25T+)", "Trailer", "Container"],
  material: ["General Cargo", "Perishable", "Hazardous", "Fragile", "Bulk", "Liquid"],
  movementType: ["FTL", "PTL", "Express", "Reverse", "Last Mile"],
};

export const roles = [
  "Admin",
  "Finance Manager",
  "Operations Head",
  "Branch Manager",
  "Logistics Coordinator",
  "Procurement Manager",
];

export const formulaVariables = [
  { name: "base_freight", label: "Base Freight" },
  { name: "distance_km", label: "Distance (km)" },
  { name: "weight", label: "Weight (MT)" },
  { name: "duration", label: "Duration (hrs)" },
  { name: "units", label: "Units" },
  { name: "detention_hours", label: "Detention Hours" },
  { name: "diversion_km", label: "Diversion (km)" },
];

export const computeOnOptions = [
  "Distance",
  "Weight",
  "PTPK",
  "Distance×Duration",
  "Units",
];

export const bulkUploadResults = [
  { row: 1, status: "Success" as const, error: "" },
  { row: 2, status: "Success" as const, error: "" },
  { row: 3, status: "Error" as const, error: "Invalid vehicle type 'XLARGE'" },
  { row: 4, status: "Success" as const, error: "" },
  { row: 5, status: "Error" as const, error: "Slab ranges not continuous: gap between 100-150" },
  { row: 6, status: "Warning" as const, error: "Duplicate priority with existing rule R002" },
  { row: 7, status: "Success" as const, error: "" },
  { row: 8, status: "Error" as const, error: "Missing required field: validity_end" },
];
