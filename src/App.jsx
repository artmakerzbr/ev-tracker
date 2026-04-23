import { useState, useEffect, useMemo, useRef } from "react";
import { supabase } from "./supabase.js";

const C = {
  bg:"#080a07", surface:"#0f1210", surfaceHi:"#161a14",
  border:"#1c2119", borderHi:"#262e22",
  textHi:"#eef2e8", textMid:"#7d8c74", textLow:"#3d4838",
  accent:"#00F563", accentDim:"#00b849", accentFaint:"#00F56314",
  tesla:"#E82127", renault:"#f0a030", danger:"#e05050",
};

// ── Icons ─────────────────────────────────────────────────────────
const IconHome = ({size=24,color=C.textMid}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M3 12L12 3L21 12V21H15V15H9V21H3V12Z" fill={color} rx="1"/>
  </svg>
);
const IconBarChart = ({size=24,color=C.textMid}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="3" y="12" width="4" height="9" rx="1.5" fill={color}/>
    <rect x="10" y="7" width="4" height="14" rx="1.5" fill={color}/>
    <rect x="17" y="3" width="4" height="18" rx="1.5" fill={color}/>
  </svg>
);
const IconReceipt = ({size=24,color=C.textMid}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M4 2h16a1 1 0 011 1v18l-2.5-2-2.5 2-2.5-2-2.5 2-2.5-2L4 21V3a1 1 0 011-1z" fill={color}/>
    <rect x="7" y="7" width="10" height="1.5" rx="0.75" fill={C.bg}/>
    <rect x="7" y="10.5" width="7" height="1.5" rx="0.75" fill={C.bg}/>
    <rect x="7" y="14" width="5" height="1.5" rx="0.75" fill={C.bg}/>
  </svg>
);

// ── Brand Logos ───────────────────────────────────────────────────
const TeslaLogo = ({size=28,color="#fff"}) => (
  <svg width={size} height={size} viewBox="-38.0376 -63.1255 329.6592 378.753" fill={color}>
    <path d="M126.806 252.502l35.476-199.519c33.815 0 44.481 3.708 46.021 18.843 0 0 22.684-8.458 34.125-25.636-44.646-20.688-89.505-21.621-89.505-21.621l-26.176 31.882.059-.004-26.176-31.883s-44.86.934-89.5 21.622c11.431 17.178 34.124 25.636 34.124 25.636 1.549-15.136 12.202-18.844 45.79-18.868l35.762 199.548"/>
    <path d="M126.792 15.36c36.09-.276 77.399 5.583 119.687 24.014 5.652-10.173 7.105-14.669 7.105-14.669C207.357 6.416 164.066.157 126.787 0 89.51.157 46.221 6.417 0 24.705c0 0 2.062 5.538 7.1 14.669 42.28-18.431 83.596-24.29 119.687-24.014h.005"/>
  </svg>
);
const RenaultLogo = ({size=28,color="#fff"}) => (
  <svg width={size*0.764} height={size} viewBox="0 0 382 500" fill={color}>
    <polygon points="219.7,89.3 200.6,125 267.4,250 152.8,464.3 38.2,250 171.9,0 133.7,0 0,250 133.7,500 171.9,500 305.6,250"/>
    <polygon points="248.3,0 210.1,0 76.4,250 162.4,410.7 181.5,375 114.6,250 229.2,35.7 343.8,250 210.1,500 248.3,500 382,250"/>
  </svg>
);

const CARS = {
  tesla:   {id:"tesla",   brand:"Tesla",   name:"Model Y",       color:C.tesla,   Logo:TeslaLogo},
  renault: {id:"renault", brand:"Renault", name:"Mégane E-Tech",  color:C.renault, Logo:RenaultLogo},
};

// ── Seed data ─────────────────────────────────────────────────────
const SEED_READINGS = [
  {value:1216.0,date:"2024-04-04",note:"",car:"tesla"},{value:1235.4,date:"2024-04-05",note:"",car:"tesla"},
  {value:1294.1,date:"2024-04-14",note:"",car:"tesla"},{value:1318.8,date:"2024-04-25",note:"",car:"tesla"},
  {value:1429.6,date:"2024-05-20",note:"",car:"tesla"},{value:1440.7,date:"2024-05-24",note:"",car:"tesla"},
  {value:1449.8,date:"2024-05-27",note:"",car:"tesla"},{value:1504.4,date:"2024-06-05",note:"",car:"tesla"},
  {value:1523.9,date:"2024-06-12",note:"",car:"tesla"},{value:1558.4,date:"2024-06-17",note:"",car:"tesla"},
  {value:1571.9,date:"2024-06-24",note:"",car:"tesla"},{value:1590.3,date:"2024-06-30",note:"",car:"tesla"},
  {value:1609.9,date:"2024-07-05",note:"",car:"tesla"},{value:1644.4,date:"2024-07-14",note:"",car:"tesla"},
  {value:1678.8,date:"2024-07-30",note:"",car:"tesla"},{value:1711.2,date:"2024-08-04",note:"",car:"tesla"},
  {value:1739.9,date:"2024-08-12",note:"",car:"tesla"},{value:1791.8,date:"2024-08-22",note:"",car:"tesla"},
  {value:1825.1,date:"2024-08-29",note:"",car:"tesla"},{value:1846.5,date:"2024-09-03",note:"",car:"tesla"},
  {value:1856.3,date:"2024-09-09",note:"",car:"tesla"},{value:1896.1,date:"2024-09-18",note:"",car:"tesla"},
  {value:1908.7,date:"2024-09-24",note:"",car:"tesla"},{value:1943.7,date:"2024-10-07",note:"",car:"tesla"},
  {value:1959.8,date:"2024-10-13",note:"",car:"tesla"},{value:1973.6,date:"2024-10-19",note:"",car:"tesla"},
  {value:1993.4,date:"2024-10-25",note:"",car:"tesla"},{value:2019.1,date:"2024-10-28",note:"",car:"tesla"},
  {value:2037.4,date:"2024-11-04",note:"",car:"tesla"},{value:2054.3,date:"2024-11-10",note:"",car:"tesla"},
  {value:2085.0,date:"2024-11-28",note:"",car:"tesla"},{value:2105.5,date:"2024-12-04",note:"",car:"tesla"},
  {value:2125.7,date:"2024-12-08",note:"",car:"tesla"},{value:2146.6,date:"2024-12-15",note:"",car:"tesla"},
  {value:2184.5,date:"2025-01-02",note:"",car:"tesla"},{value:2211.7,date:"2025-01-16",note:"",car:"tesla"},
  {value:2228.1,date:"2025-01-26",note:"",car:"tesla"},{value:2272.6,date:"2025-02-07",note:"",car:"tesla"},
  {value:2281.9,date:"2025-02-10",note:"",car:"tesla"},{value:2309.3,date:"2025-02-18",note:"",car:"tesla"},
  {value:2319.9,date:"2025-02-22",note:"",car:"tesla"},{value:2355.1,date:"2025-03-05",note:"",car:"tesla"},
  {value:2382.2,date:"2025-03-10",note:"",car:"tesla"},{value:2397.2,date:"2025-03-15",note:"",car:"tesla"},
  {value:2430.9,date:"2025-03-23",note:"",car:"tesla"},{value:2442.1,date:"2025-03-29",note:"",car:"tesla"},
  {value:2468.8,date:"2025-04-03",note:"",car:"tesla"},{value:2487.0,date:"2025-04-09",note:"",car:"tesla"},
  {value:2501.8,date:"2025-04-17",note:"",car:"tesla"},{value:2514.2,date:"2025-04-21",note:"",car:"tesla"},
  {value:2534.9,date:"2025-04-27",note:"",car:"tesla"},{value:2566.1,date:"2025-05-09",note:"",car:"tesla"},
  {value:2577.0,date:"2025-05-11",note:"",car:"tesla"},{value:2610.0,date:"2025-05-20",note:"",car:"tesla"},
  {value:2647.3,date:"2025-05-26",note:"",car:"tesla"},{value:2694.7,date:"2025-06-06",note:"",car:"tesla"},
  {value:2715.5,date:"2025-06-07",note:"",car:"tesla"},{value:2776.0,date:"2025-06-09",note:"",car:"tesla"},
  {value:2900.9,date:"2025-07-08",note:"",car:"tesla"},{value:2929.0,date:"2025-07-14",note:"",car:"tesla"},
  {value:2959.4,date:"2025-07-18",note:"",car:"tesla"},{value:2978.5,date:"2025-07-24",note:"",car:"tesla"},
  {value:2999.3,date:"2025-07-31",note:"",car:"tesla"},{value:3116.1,date:"2025-08-30",note:"",car:"tesla"},
  {value:3177.6,date:"2025-09-20",note:"",car:"tesla"},{value:3387.2,date:"2025-11-10",note:"",car:"tesla"},
  {value:3532.0,date:"2025-12-28",note:"",car:"tesla"},{value:3554.6,date:"2026-01-01",note:"",car:"tesla"},
  {value:3583.1,date:"2026-01-08",note:"",car:"tesla"},{value:3607.6,date:"2026-01-18",note:"",car:"tesla"},
  {value:3653.4,date:"2026-01-30",note:"",car:"tesla"},{value:3680.9,date:"2026-02-08",note:"",car:"tesla"},
  {value:3699.0,date:"2026-02-13",note:"",car:"tesla"},{value:3721.0,date:"2026-02-18",note:"",car:"tesla"},
  {value:3763.7,date:"2026-02-23",note:"",car:"tesla"},{value:3789.9,date:"2026-03-01",note:"",car:"tesla"},
  {value:3819.0,date:"2026-03-13",note:"",car:"tesla"},{value:3826.3,date:"2026-03-13",note:"",car:"tesla"},
  {value:3963.6,date:"2026-04-13",note:"",car:"tesla"},{value:3970.0,date:"2026-04-13",note:"",car:"tesla"},
];

const SEED_INVOICES = [
  {label:"out – nov 2025",periodo_inicio:"2025-10-01",periodo_fim:"2025-11-30",
   consumo_total_kwh:372,tarifas:[{periodo_label:"1 out a 30 nov 2025",kwh:372,preco_kwh:0.1658,iva_pct:6}]},
  {label:"dez 2025 – jan 2026",periodo_inicio:"2025-12-01",periodo_fim:"2026-01-30",
   consumo_total_kwh:385,tarifas:[
     {periodo_label:"1 dez a 31 dez 2025",kwh:172,preco_kwh:0.1658,iva_pct:6},
     {periodo_label:"1 jan a 30 jan 2026",kwh:200,preco_kwh:0.1654,iva_pct:6},
     {periodo_label:"1 jan a 30 jan 2026 (excedente)",kwh:13,preco_kwh:0.1654,iva_pct:23},
   ]},
];

// ── Helpers ───────────────────────────────────────────────────────
function today() { return new Date().toISOString().split("T")[0]; }
function fmtDate(iso) {
  if (!iso) return "—";
  return new Date(iso+"T12:00:00").toLocaleDateString("pt-PT",{day:"2-digit",month:"short"});
}
function fmtDateLong(iso) {
  if (!iso) return "—";
  return new Date(iso+"T12:00:00").toLocaleDateString("pt-PT",{day:"2-digit",month:"short",year:"numeric"});
}
function fmtMonthLabel(isoMonth) {
  const [y,m]=isoMonth.split("-");
  return new Date(parseInt(y),parseInt(m)-1,15).toLocaleDateString("pt-PT",{month:"short",year:"numeric"});
}
function daysSince(iso) {
  if (!iso) return null;
  const now = new Date();
  const then = new Date(iso+"T12:00:00");
  return Math.max(0, Math.floor((now-then)/86400000));
}
function cutoffFor(f) {
  if (f==="all") return null;
  const d=new Date();
  if (f==="month")  d.setMonth(d.getMonth()-1);
  if (f==="month3") d.setMonth(d.getMonth()-3);
  if (f==="year")   d.setFullYear(d.getFullYear()-1);
  return d.toISOString().split("T")[0];
}
function withDeltas(arr) {
  return arr.map((r,i)=>({...r,delta:i===0?null:+(r.value-arr[i-1].value).toFixed(1)}));
}
function rateForDate(date,invoices) {
  if (!date||!invoices?.length) return null;
  const inv=invoices.find(i=>date>=i.periodo_inicio&&date<=i.periodo_fim);
  if (!inv) return null;
  const total=inv.tarifas.reduce((s,t)=>s+t.kwh,0);
  if (!total) return null;
  return +inv.tarifas.reduce((s,t)=>s+(t.kwh/total)*t.preco_kwh*(1+t.iva_pct/100),0).toFixed(6);
}
function toEur(kwh,rate) {
  if (!rate||kwh==null) return null;
  return +(kwh*rate).toFixed(2);
}

// kWh → equivalent fuel cost (7L/100km petrol car, 16kWh/100km EV)
function kwhToFuelEur(kwh, petrolPrice) {
  if (!kwh||!petrolPrice) return null;
  const litres = (kwh / 16) * 7;
  return +(litres * petrolPrice).toFixed(2);
}

const PERIOD_FILTERS = [
  {id:"all",label:"Tudo"},{id:"month",label:"1m"},
  {id:"month3",label:"3m"},{id:"year",label:"1a"},
];

// ── Monthly chart ─────────────────────────────────────────────────
function MonthlyChart({sessions,invoices,fallbackRate,unit,onToggle,selectedMonth,onSelectMonth}) {
  const months = useMemo(()=>{
    const map={};
    sessions.forEach(s=>{
      if (!s.delta||s.delta<=0) return;
      const k=s.date.slice(0,7);
      if (!map[k]) map[k]={k,kwh:0,eur:0,hasRate:false,estimated:false};
      map[k].kwh=+(map[k].kwh+s.delta).toFixed(1);
      const rate=rateForDate(s.date,invoices);
      if (rate){map[k].eur=+(map[k].eur+s.delta*rate).toFixed(2);map[k].hasRate=true;}
      else if (fallbackRate){map[k].eur=+(map[k].eur+s.delta*fallbackRate).toFixed(2);map[k].estimated=true;}
    });
    return Object.values(map).sort((a,b)=>a.k.localeCompare(b.k)).slice(-12);
  },[sessions,invoices,fallbackRate]);

  if (!months.length) return null;
  const vals=months.map(m=>unit==="eur"?m.eur:m.kwh);
  const maxV=Math.max(...vals,0.1);
  const selM=selectedMonth||months[months.length-1]?.k;
  const selData=months.find(m=>m.k===selM);

  return (
    <div style={{marginBottom:28}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
        <div>
          <span style={{fontSize:9,color:C.textLow,letterSpacing:2,textTransform:"uppercase"}}>
            {selData?fmtMonthLabel(selM+"-01"):"Consumo mensal"}
          </span>
          {selData&&(
            <span style={{marginLeft:10,fontSize:12,fontWeight:700,color:C.accent}}>
              {unit==="eur"&&selData.eur>0
                ?`${selData.eur.toFixed(2)} €${selData.estimated&&!selData.hasRate?" *":""}`
                :`${selData.kwh} kWh`}
            </span>
          )}
        </div>
        {invoices.length>0&&(
          <button onClick={onToggle} style={{fontSize:9,color:C.textMid,background:"none",border:`1px solid ${C.border}`,borderRadius:12,padding:"3px 10px",cursor:"pointer",fontFamily:"inherit",letterSpacing:1}}>
            {unit==="kwh"?"ver em €":"ver em kWh"}
          </button>
        )}
      </div>
      {unit==="eur"&&selData?.estimated&&!selData?.hasRate&&(
        <div style={{fontSize:8,color:C.textLow,marginBottom:8}}>* estimativa baseada na última tarifa conhecida</div>
      )}
      <div style={{display:"flex",alignItems:"flex-end",gap:3,height:88,padding:"0 2px",marginTop:10}}>
        {months.map(m=>{
          const v=unit==="eur"?m.eur:m.kwh;
          const h=Math.max(4,Math.round((v/maxV)*76));
          const isSelected=m.k===selM;
          return (
            <div key={m.k} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:5,cursor:"pointer",userSelect:"none",WebkitUserSelect:"none"}}
              onClick={()=>onSelectMonth(m.k)}>
              <div style={{width:"100%",height:h,borderRadius:"4px 4px 0 0",background:isSelected?C.accent:m.estimated&&!m.hasRate?`${C.accent}18`:`${C.accent}35`,transition:"all 0.2s"}}/>
              <span style={{fontSize:7,color:isSelected?C.textMid:C.textLow,textTransform:"uppercase",letterSpacing:0.3,textAlign:"center",lineHeight:1.2}}>
                {fmtMonthLabel(m.k+"-01").split(" ")[0]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────
export default function App() {
  const [readings,  setReadings]  = useState([]);
  const [invoices,  setInvoices]  = useState([]);
  const [loaded,    setLoaded]    = useState(false);
  const [tab,       setTab]       = useState("home");
  const [unit,      setUnit]      = useState("kwh");
  const [selCar,    setSelCar]    = useState("tesla");
  const [saving,    setSaving]    = useState(false);
  const [toast,     setToast]     = useState(null);
  const [newValue,  setNewValue]  = useState("");
  const [showSheet, setShowSheet] = useState(false);
  const [homeUnit,  setHomeUnit]  = useState("kwh");
  const [carFilter,    setCarFilter]    = useState("all");
  const [periodFilter, setPeriodFilter] = useState("all");
  const [selectedMonth,setSelectedMonth]= useState(null);
  const [invoiceData,  setInvoiceData]  = useState(null);
  const [billingResult,setBillingResult]= useState(null);
  const [billingInv,   setBillingInv]   = useState(null);
  const [extracting,   setExtracting]   = useState(false);
  const [extractError, setExtractError] = useState(null);
  const [petrolPrice,  setPetrolPrice]  = useState(null);
  const [petrolUpdated,setPetrolUpdated]= useState(null);
  const inputRef = useRef(null);

  // ── Load ──────────────────────────────────────────────────────
  useEffect(()=>{
    async function load(){
      const {data:rData}=await supabase.from("readings").select("*").order("date",{ascending:true}).order("id",{ascending:true});
      if (rData&&rData.length>0) setReadings(rData);
      else {
        const {data:seeded}=await supabase.from("readings").insert(SEED_READINGS).select();
        if (seeded) setReadings(seeded);
      }
      const {data:iData}=await supabase.from("invoices").select("*").order("periodo_inicio",{ascending:true});
      if (iData&&iData.length>0) setInvoices(iData);
      else {
        const {data:seeded}=await supabase.from("invoices").insert(SEED_INVOICES).select();
        if (seeded) setInvoices(seeded);
      }
      const savedCar=localStorage.getItem("ev-last-car");
      if (savedCar) setSelCar(savedCar);

      // Load petrol price from localStorage cache
      const cached=localStorage.getItem("petrol-price");
      const cachedDate=localStorage.getItem("petrol-date");
      if (cached&&cachedDate) {
        setPetrolPrice(parseFloat(cached));
        setPetrolUpdated(cachedDate);
        // Refresh if older than 7 days
        const age=(new Date()-new Date(cachedDate))/86400000;
        if (age>7) fetchPetrolPrice();
      } else {
        fetchPetrolPrice();
      }
      setLoaded(true);
    }
    load();
  },[]);

  async function fetchPetrolPrice(){
    try {
      const resp=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:200,
          tools:[{type:"web_search_20250305",name:"web_search"}],
          messages:[{role:"user",content:"Qual é o preço médio actual da gasolina 95 em Portugal em euros por litro? Responde APENAS com o número, ex: 1.72"}]})});
      const data=await resp.json();
      const text=data.content?.find(b=>b.type==="text")?.text||"";
      const match=text.match(/(\d+[.,]\d+)/);
      if (match) {
        const price=parseFloat(match[1].replace(",","."));
        setPetrolPrice(price);
        const d=today();
        setPetrolUpdated(d);
        localStorage.setItem("petrol-price",price.toString());
        localStorage.setItem("petrol-date",d);
      }
    } catch {}
  }

  function toast_(m){setToast(m);setTimeout(()=>setToast(null),2200);}
  function pickCar(id){setSelCar(id);localStorage.setItem("ev-last-car",id);}

  async function addReading(){
    const val=parseFloat(newValue);
    if(isNaN(val)) return;
    const last=readings[readings.length-1];
    if(last&&val<=last.value){toast_("Valor menor que a leitura anterior");return;}
    setSaving(true);
    const {data,error}=await supabase.from("readings").insert({value:val,date:today(),note:"",car:selCar}).select().single();
    if (!error&&data){
      setReadings(r=>[...r,data]);
      setNewValue("");
      setShowSheet(false);
      toast_("Guardado ✓");
    } else toast_("Erro ao guardar");
    setSaving(false);
  }

  async function deleteReading(id){
    await supabase.from("readings").delete().eq("id",id);
    setReadings(r=>r.filter(x=>x.id!==id));
  }
  async function deleteInvoice(id){
    await supabase.from("invoices").delete().eq("id",id);
    setInvoices(i=>i.filter(x=>x.id!==id));
  }

  async function saveInvoice(){
    if(!invoiceData) return;
    const exists=invoices.find(i=>i.periodo_inicio===invoiceData.periodo_inicio&&i.periodo_fim===invoiceData.periodo_fim);
    if(exists){toast_("Período já guardado");return;}
    const {data,error}=await supabase.from("invoices").insert(invoiceData).select().single();
    if (!error&&data){
      const updated=[...invoices,data].sort((a,b)=>a.periodo_inicio.localeCompare(b.periodo_inicio));
      setInvoices(updated);
      toast_("Fatura guardada ✓");
      setInvoiceData(null);
      setTimeout(()=>calcBilling(data),100);
    } else toast_("Erro ao guardar fatura");
  }

  async function extractInvoice(file){
    setExtracting(true);setExtractError(null);setInvoiceData(null);
    try{
      const b64=await new Promise((res,rej)=>{const fr=new FileReader();fr.onload=()=>res(fr.result.split(",")[1]);fr.onerror=rej;fr.readAsDataURL(file);});
      const resp=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,
          messages:[{role:"user",content:[
            {type:"document",source:{type:"base64",media_type:"application/pdf",data:b64}},
            {type:"text",text:`Analisa esta fatura de eletricidade portuguesa. Extrai APENAS dados de consumo (ignora potência, DGEG, IEE, CAV).\nResponde APENAS com JSON, sem backticks:\n{"label":"out – nov 2025","periodo_inicio":"YYYY-MM-DD","periodo_fim":"YYYY-MM-DD","tarifas":[{"periodo_label":"...","kwh":372,"preco_kwh":0.1658,"iva_pct":6}],"consumo_total_kwh":372}`}
          ]}]})});
      const data=await resp.json();
      const text=data.content?.find(b=>b.type==="text")?.text||"";
      setInvoiceData(JSON.parse(text.replace(/```json|```/g,"").trim()));
    }catch{setExtractError("Erro ao processar. Tenta novamente.");}
    setExtracting(false);
  }

  function exportPDF(result, inv) {
    const lines = result.lines.map(l =>
      `  ${l.label}\n  ${l.kwh} kWh × ${l.preco.toFixed(4)} € = ${l.sub.toFixed(2)} €\n  IVA ${l.iva}% = ${l.vat.toFixed(2)} €`
    ).join("\n\n");
    const content = `GARAGEM · EV TRACKER
Débito ao Condomínio
${"─".repeat(40)}

Fatura: ${inv?.label || result.label}
Período: ${fmtDateLong(result.first.date)} → ${fmtDateLong(result.last.date)}

Leitura inicial: ${result.first.value} kWh
Leitura final:   ${result.last.value} kWh
Consumo total:   ${result.consumption} kWh

${"─".repeat(40)}
DETALHE DO CÁLCULO

${lines}

${"─".repeat(40)}
TOTAL A PAGAR: ${result.grand.toFixed(2)} €
${"─".repeat(40)}

Gerado em ${fmtDateLong(today())}
`;
    const blob = new Blob([content], {type:"text/plain;charset=utf-8"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `debito-condominio-${result.label?.replace(/[^a-z0-9]/gi,"-")||"fatura"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  function calcBilling(inv){
    setBillingInv(inv);
    const inRange=readings.filter(r=>r.date&&r.date>=inv.periodo_inicio&&r.date<=inv.periodo_fim);
    const before=readings.filter(r=>r.date&&r.date<inv.periodo_inicio);
    const after=readings.filter(r=>r.date&&r.date>inv.periodo_fim);
    const firstR=inRange[0]||(before.length?before[before.length-1]:null);
    const lastR=inRange[inRange.length-1]||(after.length?after[0]:null);
    if(!firstR||!lastR||firstR.id===lastR.id){setBillingResult({error:"Sem leituras suficientes"});return;}
    const consumption=+(lastR.value-firstR.value).toFixed(1);
    const tarifas=inv.tarifas||[];
    const totalKwh=inv.consumo_total_kwh||tarifas.reduce((s,t)=>s+t.kwh,0);
    let lines=[],rem=consumption;
    for(const t of tarifas){
      if(rem<=0)break;
      const ratio=totalKwh>0?t.kwh/totalKwh:1/tarifas.length;
      const lk=+(Math.min(rem,consumption*ratio)).toFixed(2);
      const sub=+(lk*t.preco_kwh).toFixed(4);
      const vat=+(sub*t.iva_pct/100).toFixed(4);
      lines.push({label:t.periodo_label,kwh:lk,preco:t.preco_kwh,iva:t.iva_pct,sub,vat,total:+(sub+vat).toFixed(4)});
      rem-=lk;
    }
    setBillingResult({consumption,lines,grand:+lines.reduce((s,l)=>s+l.total,0).toFixed(2),first:firstR,last:lastR,label:inv.label});
  }

  // ── Derived ───────────────────────────────────────────────────
  const rd=useMemo(()=>withDeltas(readings),[readings]);
  const last=readings[readings.length-1];
  const lastDelta=rd[rd.length-1]?.delta;
  const lastDays=daysSince(last?.date);
  const hasEur=invoices.length>0;

  const fallbackRate=useMemo(()=>{
    if (!invoices.length) return null;
    const inv=[...invoices].sort((a,b)=>b.periodo_fim.localeCompare(a.periodo_fim))[0];
    const total=inv.tarifas.reduce((s,t)=>s+t.kwh,0);
    if (!total) return null;
    return +inv.tarifas.reduce((s,t)=>s+(t.kwh/total)*t.preco_kwh*(1+t.iva_pct/100),0).toFixed(6);
  },[invoices]);

  const sessions=useMemo(()=>rd.filter(r=>r.delta!==null&&r.delta>0).map(s=>{
    const rate=rateForDate(s.date,invoices)||fallbackRate;
    const isEstimated=!rateForDate(s.date,invoices)&&!!fallbackRate;
    return {...s,rate,eur:toEur(s.delta,rate),estimated:isEstimated};
  }),[rd,invoices,fallbackRate]);

  const filteredSessions=useMemo(()=>{
    let s=carFilter==="all"?sessions:sessions.filter(r=>r.car===carFilter);
    const cut=cutoffFor(periodFilter);
    if(cut) s=s.filter(r=>r.date>=cut);
    return s;
  },[sessions,carFilter,periodFilter]);

  const tKwh=+sessions.filter(r=>r.car==="tesla").reduce((s,r)=>s+r.delta,0).toFixed(1);
  const rKwh=+sessions.filter(r=>r.car==="renault").reduce((s,r)=>s+r.delta,0).toFixed(1);
  const tEur=+sessions.filter(r=>r.car==="tesla"&&r.eur!=null).reduce((s,r)=>s+r.eur,0).toFixed(2);
  const rEur=+sessions.filter(r=>r.car==="renault"&&r.eur!=null).reduce((s,r)=>s+r.eur,0).toFixed(2);
  const totKwh=+(tKwh+rKwh).toFixed(1);
  const totEur=+(tEur+rEur).toFixed(2);

  const periodKwh=+filteredSessions.reduce((s,r)=>s+r.delta,0).toFixed(1);
  const periodEur=+filteredSessions.reduce((s,r)=>s+(r.eur||0),0).toFixed(2);
  const periodSessions=filteredSessions.length;

  // This month stats
  const thisMonthCut=cutoffFor("month");
  const thisMonthSessions=sessions.filter(r=>r.date&&r.date>=thisMonthCut);
  const thisMonthKwh=+thisMonthSessions.reduce((s,r)=>s+r.delta,0).toFixed(1);
  const thisMonthEur=+thisMonthSessions.reduce((s,r)=>s+(r.eur||0),0).toFixed(2);
  const thisMonthFuelSaving=petrolPrice?+(kwhToFuelEur(thisMonthKwh,petrolPrice)-thisMonthEur).toFixed(2):null;

  // Year stats
  const yearCut=cutoffFor("year");
  const yearSessions=sessions.filter(r=>r.date&&r.date>=yearCut);
  const yearKwh=+yearSessions.reduce((s,r)=>s+r.delta,0).toFixed(1);
  const yearEur=+yearSessions.reduce((s,r)=>s+(r.eur||0),0).toFixed(2);
  const yearFuelEur=petrolPrice?kwhToFuelEur(yearKwh,petrolPrice):null;
  const yearSaving=yearFuelEur!=null?+(yearFuelEur-yearEur).toFixed(2):null;

  const grouped=useMemo(()=>{
    const cut=cutoffFor(periodFilter);
    const base=cut?[...rd].filter(r=>r.date&&r.date>=cut):[...rd];
    const map={};
    [...base].reverse().forEach(r=>{
      const k=r.date?r.date.slice(0,7):"?";
      if(!map[k])map[k]=[];
      const rate=rateForDate(r.date,invoices)||fallbackRate;
      const isEst=!rateForDate(r.date,invoices)&&!!fallbackRate;
      map[k].push({...r,rate,eur:toEur(r.delta,rate),estimated:isEst});
    });
    return Object.entries(map).sort(([a],[b])=>b.localeCompare(a));
  },[rd,invoices,periodFilter,fallbackRate]);

  const lastInv=[...invoices].sort((a,b)=>b.periodo_fim.localeCompare(a.periodo_fim))[0];
  const lastInvSess=lastInv?sessions.filter(r=>r.date>=lastInv.periodo_inicio&&r.date<=lastInv.periodo_fim):[];
  const lastInvKwh=+lastInvSess.reduce((s,r)=>s+r.delta,0).toFixed(1);
  const lastInvEur=+lastInvSess.reduce((s,r)=>s+(r.eur||0),0).toFixed(2);

  // ── Styles ────────────────────────────────────────────────────
  const inp={width:"100%",padding:"18px 16px",background:C.surfaceHi,border:`1px solid ${C.border}`,borderRadius:10,color:C.textHi,fontSize:22,fontFamily:"inherit",outline:"none",boxSizing:"border-box",WebkitAppearance:"none"};
  const pill=(active,col=C.accent)=>({padding:"6px 14px",background:active?col:C.surface,color:active?C.bg:C.textMid,border:`1px solid ${active?col:C.border}`,borderRadius:20,fontSize:10,letterSpacing:1,cursor:"pointer",textTransform:"uppercase",fontFamily:"inherit",fontWeight:active?700:400,flexShrink:0});
  const card={background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:"16px"};
  const TABS=[{id:"home",label:"Home",Icon:IconHome},{id:"data",label:"Dados",Icon:IconBarChart},{id:"billing",label:"Fatura",Icon:IconReceipt}];

  // ── Header content per tab ────────────────────────────────────
  const headerContent = {
    home: (<div style={{textAlign:"center"}}>
      <div style={{fontSize:9,color:C.textLow,letterSpacing:2.5,textTransform:"uppercase",marginBottom:10}}>Último carregamento</div>
      <div style={{display:"flex",alignItems:"baseline",gap:8,justifyContent:"center",cursor:"pointer",userSelect:"none",WebkitUserSelect:"none"}}
        onClick={()=>fallbackRate&&setHomeUnit(u=>u==="kwh"?"eur":"kwh")}>
        <span style={{fontSize:52,fontWeight:700,color:C.accent,letterSpacing:-2,lineHeight:1}}>
          {loaded&&lastDelta!=null
            ?(homeUnit==="eur"&&fallbackRate
              ?`${toEur(lastDelta,rateForDate(last?.date,invoices)||fallbackRate)}`
              :`+${lastDelta}`)
            :"—"}
        </span>
        <span style={{fontSize:16,color:C.accentDim}}>{homeUnit==="eur"&&fallbackRate?"€":"kWh"}</span>
      </div>
      <div style={{fontSize:11,color:C.textMid,marginTop:8}}>
        {lastDays===0?"Hoje":lastDays===1?"Ontem":lastDays!=null?`Há ${lastDays} dias`:"Sem leituras"}
        {last?.car&&<span style={{marginLeft:6,color:CARS[last.car]?.color}}>· {CARS[last.car]?.brand}</span>}
      </div>
    </div>),
    data: (<div style={{textAlign:"center"}}>
      <div style={{fontSize:9,color:C.textLow,letterSpacing:2.5,textTransform:"uppercase",marginBottom:8}}>
        {selectedMonth?fmtMonthLabel(selectedMonth+"-01"):periodFilter==="all"?"Total acumulado":periodFilter==="month"?"Último mês":periodFilter==="month3"?"Últimos 3 meses":"Último ano"}
      </div>
      <div style={{display:"flex",alignItems:"baseline",gap:8,justifyContent:"center",cursor:"pointer",userSelect:"none",WebkitUserSelect:"none"}}
        onClick={()=>setUnit(u=>u==="kwh"?"eur":"kwh")}>
        <span style={{fontSize:44,fontWeight:700,color:C.accent,letterSpacing:-2,lineHeight:1}}>
          {unit==="eur"?`${selectedMonth
            ? +filteredSessions.filter(r=>r.date?.slice(0,7)===selectedMonth).reduce((s,r)=>s+(r.eur||0),0).toFixed(2)
            : periodEur}`
          : selectedMonth
            ? +filteredSessions.filter(r=>r.date?.slice(0,7)===selectedMonth).reduce((s,r)=>s+r.delta,0).toFixed(1)
            : periodKwh}
        </span>
        <span style={{fontSize:14,color:C.accentDim}}>{unit==="eur"?"€":"kWh"}</span>
      </div>
      <div style={{fontSize:13,color:C.textMid,marginTop:6}}>
        {(()=>{
          const s=selectedMonth
            ?filteredSessions.filter(r=>r.date?.slice(0,7)===selectedMonth)
            :filteredSessions;
          const cnt=s.length;
          const eur=+s.reduce((a,r)=>a+(r.eur||0),0).toFixed(2);
          const kwh=+s.reduce((a,r)=>a+r.delta,0).toFixed(1);
          return <>{cnt} carregamentos{unit==="kwh"&&eur>0&&<span style={{marginLeft:10,color:C.textLow}}>≈ {eur} €</span>}{unit==="eur"&&<span style={{marginLeft:10,color:C.textLow}}>{kwh} kWh</span>}</>;
        })()}
      </div>
    </div>),
    billing: lastInv?(<div style={{textAlign:"center"}}>
      <div style={{fontSize:9,color:C.textLow,letterSpacing:2.5,textTransform:"uppercase",marginBottom:8}}>Última fatura · {lastInv.label}</div>
      <div style={{display:"flex",alignItems:"baseline",gap:8,justifyContent:"center"}}>
        <span style={{fontSize:44,fontWeight:700,color:C.accent,letterSpacing:-2,lineHeight:1}}>{lastInvEur}</span>
        <span style={{fontSize:14,color:C.accentDim}}>€</span>
      </div>
      <div style={{fontSize:11,color:C.textMid,marginTop:6}}>
        {lastInvKwh} kWh · {fmtDate(lastInv.periodo_inicio)} → {fmtDate(lastInv.periodo_fim)}
      </div>
    </div>):(<div style={{textAlign:"center"}}>
      <div style={{fontSize:9,color:C.textLow,letterSpacing:2.5,textTransform:"uppercase",marginBottom:8}}>Faturas</div>
      <div style={{fontSize:16,color:C.textMid,marginTop:6}}>Sem faturas guardadas</div>
    </div>),
  };

  if (!loaded) return (
    <div style={{background:C.bg,minHeight:"100dvh",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'IBM Plex Mono',monospace"}}>
      <span style={{fontSize:11,color:C.textLow,letterSpacing:2,textTransform:"uppercase"}}>A carregar…</span>
    </div>
  );

  return (
    <div style={{fontFamily:"'IBM Plex Mono',monospace",background:C.bg,minHeight:"100dvh",color:C.textHi,maxWidth:480,margin:"0 auto",paddingBottom:80}}>

      {/* HEADER */}
      <div style={{padding:"32px 20px 24px",borderBottom:`1px solid ${C.border}`,textAlign:"center"}}>
        <div style={{fontSize:10,color:C.textLow,letterSpacing:3,textTransform:"uppercase",marginBottom:20}}>Garagem · EV Tracker</div>
        {headerContent[tab]}
      </div>

      {/* ══ HOME ═════════════════════════════════════════════════ */}
      {tab==="home"&&(
        <div style={{padding:"24px 20px"}}>

          {/* Car selector */}
          <div style={{display:"flex",gap:10,marginBottom:24}}>
            {Object.values(CARS).map(car=>{
              const active=selCar===car.id;
              return (
                <button key={car.id} onClick={()=>pickCar(car.id)} style={{
                  flex:1,padding:"16px 14px",
                  background:active?`${car.color}10`:C.surface,
                  border:`1.5px solid ${active?car.color:C.border}`,
                  borderRadius:12,cursor:"pointer",
                  display:"flex",alignItems:"center",gap:14,
                  transition:"all 0.15s",
                }}>
                  <car.Logo size={32} color={active?car.color:C.textLow}/>
                  <div>
                    <div style={{fontSize:12,letterSpacing:1,color:active?car.color:C.textMid,textTransform:"uppercase",fontFamily:"inherit",fontWeight:active?700:400}}>{car.brand}</div>
                    <div style={{fontSize:9,color:active?car.color+"66":C.textLow,fontFamily:"inherit",marginTop:3}}>{car.name}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Register button */}
          <button onClick={()=>{setShowSheet(true);setTimeout(()=>inputRef.current?.focus(),100);}} style={{
            width:"100%",padding:"18px",
            background:C.accent,color:C.bg,
            border:"none",borderRadius:12,fontSize:13,fontWeight:700,
            letterSpacing:2,textTransform:"uppercase",cursor:"pointer",fontFamily:"inherit",
            marginBottom:20,
          }}>Registar Leitura</button>

          {/* Stats grid */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
            <div style={card}>
              <div style={{fontSize:9,color:C.textLow,letterSpacing:1.5,textTransform:"uppercase",marginBottom:8}}>Este mês</div>
              {thisMonthEur>0?(
                <>
                  <div style={{fontSize:26,fontWeight:700,color:C.accent,lineHeight:1}}>{thisMonthEur} €</div>
                  <div style={{fontSize:11,color:C.textMid,marginTop:5}}>{thisMonthKwh} kWh</div>
                </>
              ):(
                <>
                  <div style={{fontSize:26,fontWeight:700,color:C.textHi,lineHeight:1}}>{thisMonthKwh}</div>
                  <div style={{fontSize:11,color:C.textMid,marginTop:5}}>kWh</div>
                </>
              )}
            </div>
            <div style={card}>
              <div style={{fontSize:9,color:C.textLow,letterSpacing:1.5,textTransform:"uppercase",marginBottom:8}}>Último ano</div>
              {yearEur>0?(
                <>
                  <div style={{fontSize:26,fontWeight:700,color:C.accent,lineHeight:1}}>{yearEur} €</div>
                  <div style={{fontSize:11,color:C.textMid,marginTop:5}}>{yearKwh} kWh</div>
                </>
              ):(
                <>
                  <div style={{fontSize:26,fontWeight:700,color:C.textHi,lineHeight:1}}>{yearKwh}</div>
                  <div style={{fontSize:11,color:C.textMid,marginTop:5}}>kWh</div>
                </>
              )}
            </div>
          </div>

          {/* Fuel saving card */}
          {petrolPrice?(
            <div style={{...card,borderLeft:`3px solid ${C.accentDim}`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                <div style={{fontSize:9,color:C.textLow,letterSpacing:1.5,textTransform:"uppercase"}}>Poupança vs gasolina</div>
                <div style={{fontSize:8,color:C.textLow}}>{petrolPrice.toFixed(3)} €/L · {petrolUpdated&&fmtDate(petrolUpdated)}</div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                <div>
                  <div style={{fontSize:9,color:C.textLow,marginBottom:4}}>Este mês</div>
                  <div style={{fontSize:22,fontWeight:700,color:thisMonthFuelSaving>0?C.accent:C.danger}}>
                    {thisMonthFuelSaving!=null?`${thisMonthFuelSaving>0?"+":""}${thisMonthFuelSaving} €`:"—"}
                  </div>
                </div>
                <div>
                  <div style={{fontSize:9,color:C.textLow,marginBottom:4}}>Último ano</div>
                  <div style={{fontSize:22,fontWeight:700,color:yearSaving>0?C.accent:C.danger}}>
                    {yearSaving!=null?`${yearSaving>0?"+":""}${yearSaving} €`:"—"}
                  </div>
                </div>
              </div>
              <div style={{fontSize:8,color:C.textLow,marginTop:10}}>vs carro a gasolina equiv. (7L/100km)</div>
            </div>
          ):(
            <div style={{...card,opacity:0.5}}>
              <div style={{fontSize:9,color:C.textLow,letterSpacing:1.5,textTransform:"uppercase",marginBottom:6}}>Poupança vs gasolina</div>
              <div style={{fontSize:11,color:C.textLow}}>A obter preço da gasolina…</div>
            </div>
          )}
        </div>
      )}

      {/* ══ DATA ════════════════════════════════════════════════ */}
      {tab==="data"&&(
        <div style={{padding:"20px 20px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24,gap:8}}>
            <div style={{display:"flex",gap:6}}>
              <button style={pill(carFilter==="all")} onClick={()=>setCarFilter("all")}>Todos</button>
              <button style={pill(carFilter==="tesla",C.tesla)} onClick={()=>setCarFilter("tesla")}>Tesla</button>
              <button style={pill(carFilter==="renault",C.renault)} onClick={()=>setCarFilter("renault")}>Renault</button>
            </div>
            <div style={{display:"flex",gap:4}}>
              {PERIOD_FILTERS.map(f=>(
                <button key={f.id} onClick={()=>{setPeriodFilter(f.id);setSelectedMonth(null);}} style={{
                  padding:"5px 10px",background:periodFilter===f.id?C.surfaceHi:"none",
                  color:periodFilter===f.id?C.textHi:C.textLow,
                  border:`1px solid ${periodFilter===f.id?C.border:"transparent"}`,
                  borderRadius:8,fontSize:9,letterSpacing:1,cursor:"pointer",
                  textTransform:"uppercase",fontFamily:"inherit",
                }}>{f.label}</button>
              ))}
            </div>
          </div>

          <MonthlyChart sessions={filteredSessions} invoices={invoices} fallbackRate={fallbackRate} unit={unit}
            onToggle={()=>setUnit(u=>u==="kwh"?"eur":"kwh")}
            selectedMonth={selectedMonth} onSelectMonth={setSelectedMonth}/>

          {carFilter==="all"&&(
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:28}}>
              {Object.values(CARS).map(car=>{
                const kwh=car.id==="tesla"?tKwh:rKwh;
                const eur=car.id==="tesla"?tEur:rEur;
                const pct=totKwh>0?Math.round((kwh/totKwh)*100):0;
                const cnt=sessions.filter(r=>r.car===car.id).length;
                const showEur=unit==="eur";
                return (
                  <div key={car.id} style={{...card,borderTop:`2px solid ${car.color}`,cursor:"pointer",userSelect:"none",WebkitUserSelect:"none"}}
                    onClick={()=>setUnit(u=>u==="kwh"?"eur":"kwh")}>
                    <div style={{marginBottom:10,display:"flex",justifyContent:"center"}}><car.Logo size={32} color={car.color}/></div>
                    <div style={{fontSize:9,color:C.textMid,letterSpacing:1,textTransform:"uppercase",marginBottom:3}}>{car.brand}</div>
                    <div style={{fontSize:24,fontWeight:700,color:car.color,lineHeight:1}}>{showEur?eur.toFixed(2):kwh.toFixed(1)}</div>
                    <div style={{fontSize:9,color:C.textMid,marginBottom:10}}>{showEur?"€":`kWh · ${cnt} sessões`}</div>
                    {showEur&&<div style={{fontSize:9,color:C.textLow,marginBottom:8}}>{kwh.toFixed(1)} kWh</div>}
                    <div style={{height:3,background:C.border,borderRadius:2}}>
                      <div style={{height:"100%",width:`${pct}%`,background:car.color,borderRadius:2}}/>
                    </div>
                    <div style={{fontSize:9,color:C.textMid,marginTop:5}}>{pct}%</div>
                  </div>
                );
              })}
            </div>
          )}

          {grouped.map(([monthKey,rows])=>{
            const ms=rows.filter(r=>r.delta&&r.delta>0);
            const mKwh=+ms.reduce((s,r)=>s+r.delta,0).toFixed(1);
            const mEur=+ms.reduce((s,r)=>s+(r.eur||0),0).toFixed(2);
            const filtRows=carFilter==="all"?rows:rows.filter(r=>r.car===carFilter);
            if(!filtRows.length) return null;
            return (
              <div key={monthKey} style={{marginBottom:24}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10,paddingBottom:8,borderBottom:`1px solid ${C.border}`}}>
                  <span style={{fontSize:9,color:C.textMid,letterSpacing:2,textTransform:"uppercase"}}>{fmtMonthLabel(monthKey+"-01")}</span>
                  <span style={{fontSize:11,color:C.textMid,fontWeight:600,cursor:"pointer",userSelect:"none",WebkitUserSelect:"none"}}
                    onClick={()=>setUnit(u=>u==="kwh"?"eur":"kwh")}>
                    {unit==="eur"&&mEur>0?`${mEur} €`:mKwh>0?`${mKwh} kWh`:"—"}
                  </span>
                </div>
                {filtRows.map(r=>(
                  <div key={r.id} style={{padding:"10px 0",borderBottom:`1px solid ${C.border}22`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      {r.car&&<div style={{width:5,height:5,borderRadius:"50%",background:CARS[r.car]?.color,flexShrink:0}}/>}
                      <div>
                        <div style={{fontSize:15,color:C.textHi,fontWeight:600}}>
                          {r.value.toLocaleString("pt-PT",{minimumFractionDigits:1})}
                          <span style={{fontSize:9,color:C.textLow,marginLeft:3}}>kWh</span>
                        </div>
                        <div style={{fontSize:10,color:C.textMid,marginTop:2,display:"flex",gap:8}}>
                          <span>{fmtDate(r.date)}</span>
                          {r.car&&<span style={{color:(CARS[r.car]?.color||C.textLow)+"99"}}>{CARS[r.car]?.brand}</span>}
                        </div>
                      </div>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      {r.delta!=null&&r.delta>0&&(
                        <div onClick={()=>setUnit(u=>u==="kwh"?"eur":"kwh")} style={{cursor:"pointer",userSelect:"none",WebkitUserSelect:"none",textAlign:"right"}}>
                          <div style={{fontSize:12,fontWeight:600,color:unit==="eur"&&r.eur!=null?r.estimated?C.textMid:C.accentDim:C.accent}}>
                            {unit==="eur"?(r.eur!=null?`${r.eur} €${r.estimated?" *":""}` :"—"):`+${r.delta} kWh`}
                          </div>
                        </div>
                      )}
                      <button onClick={()=>deleteReading(r.id)} style={{background:"none",border:"none",color:C.textLow,cursor:"pointer",fontSize:16,padding:"2px 4px",lineHeight:1}}>×</button>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}

      {/* ══ BILLING ════════════════════════════════════════════ */}
      {tab==="billing"&&(
        <div style={{padding:"24px 20px"}}>
          <div style={{marginBottom:32}}>
            <div style={{fontSize:9,color:C.textMid,letterSpacing:2.5,textTransform:"uppercase",marginBottom:14}}>
              Faturas guardadas <span style={{color:C.textLow}}>({invoices.length})</span>
            </div>
            {invoices.slice().reverse().map(inv=>{
              const invSess=sessions.filter(r=>r.date>=inv.periodo_inicio&&r.date<=inv.periodo_fim);
              const invKwh=+invSess.reduce((s,r)=>s+r.delta,0).toFixed(1);
              const invEur=+invSess.reduce((s,r)=>s+(r.eur||0),0).toFixed(2);
              const isResult=billingResult?.label===inv.label;
              return (
                <div key={inv.id} style={{...card,marginBottom:10,border:`1px solid ${isResult?C.accentDim:C.border}`}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                    <div>
                      <div style={{fontSize:12,color:C.textHi,marginBottom:3,fontWeight:600}}>{inv.label}</div>
                      <div style={{fontSize:9,color:C.textLow}}>{fmtDateLong(inv.periodo_inicio)} → {fmtDateLong(inv.periodo_fim)}</div>
                    </div>
                    <button onClick={()=>deleteInvoice(inv.id)} style={{background:"none",border:"none",color:C.textLow,cursor:"pointer",fontSize:16,padding:"0 0 0 12px",lineHeight:1}}>×</button>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:8}}>
                    <div><div style={{fontSize:8,color:C.textLow,letterSpacing:1.5,textTransform:"uppercase",marginBottom:3}}>Consumo</div><div style={{fontSize:14,fontWeight:600,color:C.textMid}}>{invKwh} kWh</div></div>
                    <div><div style={{fontSize:8,color:C.textLow,letterSpacing:1.5,textTransform:"uppercase",marginBottom:3}}>Estimado</div><div style={{fontSize:14,fontWeight:700,color:C.accent}}>{invEur} €</div></div>
                    <div><div style={{fontSize:8,color:C.textLow,letterSpacing:1.5,textTransform:"uppercase",marginBottom:3}}>Tarifa</div><div style={{fontSize:11,color:C.textMid}}>{inv.tarifas?.[0]?.preco_kwh.toFixed(4)} €</div></div>
                  </div>
                  <button onClick={()=>calcBilling(inv)} style={{width:"100%",padding:"8px",background:"none",color:C.textLow,border:`1px solid ${C.border}`,borderRadius:6,fontSize:9,letterSpacing:2,textTransform:"uppercase",cursor:"pointer",fontFamily:"inherit"}}>
                    ver débito detalhado
                  </button>
                </div>
              );
            })}
          </div>

          {billingResult&&(
            <div style={{marginBottom:32}}>
              {billingResult.error?(
                <div style={{color:C.danger,fontSize:12,padding:14,background:`${C.danger}12`,borderRadius:10}}>{billingResult.error}</div>
              ):(
                <div style={{...card,borderTop:`3px solid ${C.accent}`}}>
                  <div style={{fontSize:9,color:C.textMid,letterSpacing:2,textTransform:"uppercase",marginBottom:6}}>{billingResult.label} · deves ao condomínio</div>
                  <div style={{fontSize:52,fontWeight:700,color:C.accent,letterSpacing:-2,lineHeight:1,marginBottom:4}}>{billingResult.grand.toFixed(2)} €</div>
                  <div style={{fontSize:12,color:C.textMid,marginBottom:20}}>{billingResult.consumption} kWh</div>
                  <div style={{borderTop:`1px solid ${C.border}`,paddingTop:14}}>
                    <BRow label="Leitura inicial" value={`${billingResult.first.value} · ${fmtDateLong(billingResult.first.date)}`}/>
                    <BRow label="Leitura final" value={`${billingResult.last.value} · ${fmtDateLong(billingResult.last.date)}`}/>
                    {billingResult.lines.map((l,i)=>(
                      <div key={i} style={{marginTop:10}}>
                        <div style={{fontSize:8,color:C.textLow,letterSpacing:1,textTransform:"uppercase",marginBottom:4}}>{l.label}</div>
                        <BRow label={`${l.kwh} kWh × ${l.preco.toFixed(4)} €`} value={`${l.sub.toFixed(2)} €`}/>
                        <BRow label={`IVA ${l.iva}%`} value={`${l.vat.toFixed(2)} €`}/>
                      </div>
                    ))}
                  </div>
                  <button onClick={()=>exportPDF(billingResult,billingInv)} style={{
                    width:"100%",padding:"12px",marginTop:16,
                    background:"none",color:C.textMid,
                    border:`1px solid ${C.border}`,borderRadius:8,
                    fontSize:10,letterSpacing:2,textTransform:"uppercase",
                    cursor:"pointer",fontFamily:"inherit",
                  }}>
                    Exportar documento
                  </button>
                </div>
              )}
            </div>
          )}

          <div>
            <div style={{fontSize:9,color:C.textMid,letterSpacing:2.5,textTransform:"uppercase",marginBottom:12}}>Adicionar fatura</div>
            <label style={{display:"flex",alignItems:"center",justifyContent:"center",padding:"24px",border:`1.5px dashed ${invoiceData?C.accentDim:C.border}`,borderRadius:12,background:invoiceData?`${C.accent}08`:C.surface,cursor:"pointer",minHeight:80}}>
              <input type="file" accept="application/pdf" style={{display:"none"}} onChange={e=>e.target.files[0]&&extractInvoice(e.target.files[0])}/>
              {extracting?(<span style={{fontSize:11,color:C.textMid}}>A analisar fatura…</span>
              ):invoiceData?(
                <div style={{textAlign:"center"}}>
                  <div style={{fontSize:12,color:C.accent,marginBottom:4,fontWeight:600}}>✓ {invoiceData.label}</div>
                  <div style={{fontSize:10,color:C.textMid}}>{invoiceData.consumo_total_kwh} kWh · {invoiceData.tarifas?.length} tarifa(s)</div>
                  <div style={{fontSize:9,color:C.textLow,marginTop:3}}>Toca para substituir</div>
                </div>
              ):(<span style={{fontSize:11,color:C.textMid}}>Carregar PDF da fatura</span>)}
            </label>
            {extractError&&<div style={{color:C.danger,fontSize:11,marginTop:8,padding:"10px 14px",background:`${C.danger}15`,borderRadius:8}}>{extractError}</div>}
            {invoiceData&&(
              <button onClick={saveInvoice} style={{width:"100%",padding:"16px",marginTop:12,background:C.accent,color:C.bg,border:"none",borderRadius:10,fontSize:12,fontWeight:700,letterSpacing:2,textTransform:"uppercase",cursor:"pointer",fontFamily:"inherit"}}>
                Guardar fatura
              </button>
            )}
          </div>
        </div>
      )}

      {/* FOOTER NAV */}
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,background:`${C.bg}f2`,backdropFilter:"blur(12px)",borderTop:`1px solid ${C.border}`,display:"flex",zIndex:20,paddingBottom:"env(safe-area-inset-bottom,0px)"}}>
        {TABS.map(t=>{
          const active=tab===t.id;
          return (
            <button key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,padding:"14px 0 12px",background:"none",border:"none",display:"flex",flexDirection:"column",alignItems:"center",gap:5,cursor:"pointer"}}>
              <div style={{padding:"6px 16px",borderRadius:20,background:active?`${C.accent}18`:"transparent",transition:"background 0.2s"}}>
                <t.Icon size={22} color={active?C.accent:C.textLow}/>
              </div>
              <span style={{fontSize:9,letterSpacing:1,color:active?C.accent:C.textLow,textTransform:"uppercase",fontFamily:"inherit"}}>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* READING SHEET */}
      {showSheet&&(
        <>
          <div onClick={()=>setShowSheet(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",zIndex:30}}/>
          <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,background:C.surface,borderRadius:"20px 20px 0 0",padding:"24px 20px 40px",zIndex:40,borderTop:`1px solid ${C.border}`}}>
            <div style={{width:40,height:4,background:C.border,borderRadius:2,margin:"0 auto 24px"}}/>
            <div style={{fontSize:9,color:C.textMid,letterSpacing:2.5,textTransform:"uppercase",marginBottom:16,textAlign:"center"}}>
              {CARS[selCar]?.brand} · {CARS[selCar]?.name}
            </div>
            <input ref={inputRef} type="number" inputMode="decimal" value={newValue}
              onChange={e=>setNewValue(e.target.value)}
              placeholder={last?`> ${last.value}`:"0.0"}
              style={inp} onKeyDown={e=>e.key==="Enter"&&addReading()}/>
            <button onClick={addReading} disabled={!newValue||saving} style={{
              width:"100%",padding:"18px",marginTop:12,
              background:newValue?C.accent:C.surfaceHi,
              color:newValue?C.bg:C.textLow,
              border:"none",borderRadius:12,fontSize:13,fontWeight:700,
              letterSpacing:2,textTransform:"uppercase",
              cursor:newValue?"pointer":"not-allowed",fontFamily:"inherit",
            }}>
              {saving?"A guardar…":"Guardar"}
            </button>
          </div>
        </>
      )}

      {toast&&<div style={{position:"fixed",bottom:88,left:"50%",transform:"translateX(-50%)",background:C.accent,color:C.bg,padding:"10px 24px",borderRadius:40,fontSize:11,fontWeight:700,letterSpacing:1,zIndex:100,whiteSpace:"nowrap"}}>{toast}</div>}
    </div>
  );
}

function BRow({label,value}){
  return(
    <div style={{display:"flex",justifyContent:"space-between",marginBottom:6,alignItems:"baseline"}}>
      <span style={{fontSize:11,color:"#7d8c74"}}>{label}</span>
      <span style={{fontSize:12,color:"#b8c8a0"}}>{value}</span>
    </div>
  );
}