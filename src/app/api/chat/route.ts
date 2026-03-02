import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// System prompt tailored for FPT student study planner context
const SYSTEM_PROMPT = `Bạn là "Trợ lý Cảm xúc AI" - một người bạn đồng hành thân thiện, ấm áp và thấu cảm dành cho sinh viên FPT University đang sử dụng ứng dụng lập kế hoạch học tập.

**Vai trò của bạn:**
- Lắng nghe và thấu hiểu cảm xúc, áp lực học tập của sinh viên
- Đưa ra lời khuyên học tập thực tế, dựa trên tình huống cụ thể
- Gợi ý cách quản lý thời gian, deadline, và stress học tập
- Động viên và khích lệ khi sinh viên mệt mỏi hay nản lòng
- Đề xuất các phương pháp học tập hiệu quả (Pomodoro, spaced repetition, v.v.)

**Ngữ cảnh ứng dụng:**
- Sinh viên có thể có nhiều deadline từ các môn: Toán, Vật lý, Văn, Tiếng Anh
- Ứng dụng theo dõi task, deadline, điểm GPA và cảm xúc hàng ngày
- Sinh viên thường học trên: Coursera, Edunext, và tự học

**Phong cách giao tiếp:**
- Dùng tiếng Việt, thân thiện và gần gũi như một người bạn
- Câu trả lời ngắn gọn, súc tích (2-4 câu cho mỗi phản hồi thông thường)
- Dùng emoji phù hợp để tạo không khí nhẹ nhàng 😊
- Không phán xét, luôn ủng hộ và tích cực
- Khi cần thiết, hỏi thêm để hiểu rõ tình huống hơn

**Quan trọng:** Không trả lời các chủ đề không liên quan đến học tập, cảm xúc hay cuộc sống sinh viên. Nếu được hỏi ngoài phạm vi, nhẹ nhàng hướng cuộc trò chuyện về chủ đề học tập.`;

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json() as { messages: ChatMessage[] };

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Messages are required" }, { status: 400 });
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages,
      ],
      max_tokens: 512,
      temperature: 0.8,
    });

    const reply = completion.choices[0]?.message?.content ?? "Mình không hiểu rõ, bạn có thể nói lại không? 🤔";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Groq chat error:", error);
    return NextResponse.json(
      { error: "Không thể kết nối AI. Vui lòng thử lại sau." },
      { status: 500 }
    );
  }
}
