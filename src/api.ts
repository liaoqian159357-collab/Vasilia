export type InquiryPayload = Record<string, FormDataEntryValue>;

export type TrackingResult = {
  number: string;
  status: string;
  location: string;
  temperature: string;
  eta: string;
  progress: number;
  milestones: string[];
};

export type Office = {
  city: string;
  region: string;
  address: string;
  phone: string;
  x: number;
  y: number;
};

const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

export async function submitInquiry(payload: InquiryPayload) {
  await wait(850);
  return { ok: true, reference: `VAS-${Date.now().toString().slice(-6)}`, payload };
}

export async function trackShipment(number: string, chinese: boolean): Promise<TrackingResult | null> {
  await wait(700);
  if (number.trim().toUpperCase() !== "VAS20260618") return null;
  return chinese
    ? { number: "VAS20260618", status: "运输中", location: "德国汉堡港", temperature: "4.2°C", eta: "2026年6月26日", progress: 68, milestones: ["上海仓库已收货", "洋山港已装船", "抵达汉堡港", "等待末端配送"] }
    : { number: "VAS20260618", status: "In transit", location: "Port of Hamburg, Germany", temperature: "4.2°C", eta: "Jun 26, 2026", progress: 68, milestones: ["Received in Shanghai", "Loaded at Yangshan", "Arrived in Hamburg", "Final delivery pending"] };
}

export const offices: Office[] = [
  { city: "上海", region: "华东", address: "待替换：上海市 XX 路 XXX 号", phone: "待替换：400 000 0000", x: 76, y: 59 },
  { city: "深圳", region: "华南", address: "待替换：深圳市 XX 大道 XXX 号", phone: "待替换：0755 0000 0000", x: 70, y: 79 },
  { city: "成都", region: "西南", address: "待替换：成都市 XX 路 XXX 号", phone: "待替换：028 0000 0000", x: 45, y: 66 },
  { city: "青岛", region: "华北", address: "待替换：青岛市 XX 路 XXX 号", phone: "待替换：0532 0000 0000", x: 72, y: 43 },
];
