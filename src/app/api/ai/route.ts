import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    const prompt = `
      Anda adalah seorang Konsultan Bisnis Ritel untuk platform E-commerce 'Lumina'. 
      Analisis data penjualan ini dan berikan rekomendasi pengisian stok atau strategi dalam 3 poin singkat.
      Gunakan bahasa Indonesia yang profesional.
      
      Data:
      Pendapatan: ${data.revenue}
      Total Pesanan: ${data.orders}
      Stok Habis: ${data.alerts} item
      Konteks Utama: Trafik dari Generasi Z tinggi, dan akan ada Flash Sale segera.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const recommendation = response.text || "Tidak ada rekomendasi yang tersedia saat ini.";

    return NextResponse.json({ recommendation });
  } catch (error: any) {
    console.error('AI Error:', error);
    return NextResponse.json(
      { error: 'Gagal menjalankan analisis AI', details: error.message },
      { status: 500 }
    );
  }
}
