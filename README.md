# Last-Minute Exam Preparation Guide

An AI-powered study companion that turns your syllabus, previous year questions (PYQs), and notes into a personalized, time-boxed revision plan — plus a quiz to test yourself before you walk into the exam.

## 🎯 Problem Statement

Students often have limited time before an exam and too much material to cover. Manually figuring out *what* to study, *in what order*, and *how deep* to go is stressful and inefficient. This tool automates that decision-making by generating a prioritized, minute-by-minute revision plan based on what actually matters for the exam.

## ✨ Features

- **Multi-format Upload** — Students can upload their syllabus, PYQ papers, and class notes (PDF, DOCX, images, or text).
- **Time-Aware Planning** — Enter the time remaining before the exam (e.g., 6 hours, 1 day, 3 days) and get a plan scaled to fit.
- **Exam ROI Analysis** — Ranks topics by "Return on Investment" — how often they appear in PYQs vs. how long they take to revise.
- **Priority Timeline** — A detailed, timestamped revision plan (e.g., `0:00–0:25 → CPU Scheduling Algorithms`) broken into "Must Know," "Should Know," and "Skip For Now" tiers.
- **Ultra-Short Notes** — Condensed, high-yield summaries of key topics for quick last-minute review.
- **Formulas & PYQs** — Auto-extracted key formulas along with the most likely repeated questions from past papers.
- **5-Minute Cheat Sheet** — A final, ultra-condensed recap right before the exam.
- **Auto-Generated Quiz** — A short quiz at the end of the plan to self-test retention before the exam.

## 🧭 How It Works

1. **Upload** — Student uploads syllabus, PYQs, and notes.
2. **Input Time Remaining** — Student specifies how much time is left before the exam.
3. **Analyze** — The system parses the documents, identifies high-frequency and high-weightage topics, and cross-references them with the syllabus.
4. **Generate Plan** — Based on time remaining, the app builds a tiered, timestamped revision timeline:
   - `Exam ROI` — topic-wise priority ranking
   - `Priority Timeline` — minute-by-minute plan
   - `Skip For Now` — low-yield topics to deprioritize
   - `Ultra-Short Notes` — quick-glance summaries
   - `Formulas & PYQs` — key formulas + likely repeated questions
   - `5-Minute Cheat Sheet` — final recap
5. **Quiz** — Student takes a short auto-generated quiz to validate their prep before the exam.

## 🖥️ Tech Stack

> _Update this section with your actual stack._

- **Frontend:** (e.g., React / Next.js, deployed on Vercel)
- **Backend:** (e.g., Node.js / Python)
- **AI/NLP:** (e.g., Anthropic Claude API / OpenAI API for document parsing, summarization, and quiz generation)
- **File Handling:** PDF/DOCX/image parsing for syllabus, notes, and PYQs
- **Hosting:** Vercel

## 🚀 Getting Started

\`\`\`bash
# Clone the repo
git clone https://github.com/<your-username>/last-minute-exam-preparation-guide.git
cd last-minute-exam-preparation-guide

# Install dependencies
npm install

# Run locally
npm run dev
\`\`\`

Visit `http://localhost:3000` to use the app locally.

## 📁 Usage

1. Go to the homepage and upload your syllabus, notes, and PYQ files.
2. Enter the number of hours/days remaining before your exam.
3. Click **Generate Plan**.
4. Navigate through the tabs: `Exam ROI`, `Priority Timeline`, `Skip For Now`, `Ultra-Short Notes`, `Formulas & PYQs`, and `5-Min Cheat Sheet`.
5. Finish with the **Quiz** tab to test yourself.

## 🗺️ Roadmap

- [ ] Support for handwritten notes via OCR
- [ ] Difficulty-adaptive quiz generation
- [ ] Multi-subject / multi-exam scheduling
- [ ] Progress tracking across multiple sessions
- [ ] Mobile app version

## 🤝 Contributing

Contributions are welcome! Please open an issue to discuss what you'd like to change before submitting a pull request.

## 📄 License

> _Add your license here (e.g., MIT)._

## 🙏 Acknowledgements

Built for **Smart India Hackathon (SIH) 2025** as a solution to help students prepare effectively under time pressure.
