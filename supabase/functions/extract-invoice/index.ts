import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  try {
    const { pdf_base64 } = await req.json();
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": Deno.env.get("ANTHROPIC_API_KEY") ?? "",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        messages: [{
          role: "user",
          content: [
            { type: "document", source: { type: "base64", media_type: "application/pdf", data: pdf_base64 } },
            { type: "text", text: "Analisa esta fatura de eletricidade portuguesa. Extrai APENAS dados de consumo (ignora potencia, DGEG, IEE, CAV).\nResponde APENAS com JSON, sem backticks:\n{\"label\":\"out - nov 2025\",\"periodo_inicio\":\"YYYY-MM-DD\",\"periodo_fim\":\"YYYY-MM-DD\",\"tarifas\":[{\"periodo_label\":\"...\",\"kwh\":372,\"preco_kwh\":0.1658,\"iva_pct\":6}],\"consumo_total_kwh\":372}" }
          ]
        }]
      }),
    });
    const data = await response.json();
    const text = data.content?.find((b: any) => b.type === "text")?.text ?? "";
    const result = JSON.parse(text.replace(/```json|```/g, "").trim());
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
