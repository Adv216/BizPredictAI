# BizPredictAI 🚀

**AI-Powered Business Intelligence Platform for Indian Entrepreneurs**

---

## 🎯 Overview

**BizPredictAI** helps Indian entrepreneurs validate business ideas through AI-powered predictions, market intelligence, and strategic planning tools.

### What You Get
- 📊 Success predictions with profit forecasts & ROI calculations
- 🧠 AI-generated SWOT analysis & strategic insights
- 🎯 Investor pitch decks with speaker notes
- 📋 India-specific legal registration checklists
- 📈 Real-time startup ecosystem trends
- 💰 Funding calculators & EMI planners
- ...and 7+ more tools

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| **Evaluate Business** | Predict success % (1-100), profit, ROI, break-even months |
| **SWOT Analysis** | 16-point strategic analysis tailored to your industry & city |
| **Pitch Generator** | 8-slide investor deck with elevator pitch |
| **Legal Checklist** | Step-by-step registration guide (GST, MSME, FSSAI, etc.) |
| **Name Generator** | AI startup names with taglines & domain suggestions |
| **Market Intel** | Competitor research, trends, peak seasons |
| **Action Plan** | 90-day launch checklist with milestones |
| **Readiness Quiz** | 10-question assessment with personalized feedback |
| **Trends Dashboard** | India startup ecosystem stats (funding, unicorns, sectors) |
| **Funding Calculator** | EMI planner with government scheme matcher |
| **Heatmap** | Interactive city opportunity map (25 industries × 20 cities) |
| **Compare** | Side-by-side analysis of 3 business ideas |
| **Suggest Ideas** | AI recommendations based on budget & location |

---

## 🛠️ Tech Stack

**Backend**: Python 3.9+ · FastAPI · SQLite · Pydantic · Uvicorn  
**Frontend**: Next.js 14 · React 18 · TypeScript · Chart.js  
**Deployment**: Vercel (Frontend) · Railway (Backend) - Optional

---

## 📦 Installation

### Prerequisites
- Python 3.9+
- Node.js 18+
- Git

### Quick Start

```bash
# 1. Clone repository
git clone https://github.com/YOUR_USERNAME/BizPredictAI.git
cd BizPredictAI

# 2. Setup Backend
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Mac/Linux
pip install fastapi uvicorn pydantic sqlalchemy
python -m uvicorn main:app --reload

# ✓ Backend runs on http://127.0.0.1:8000

# 3. Setup Frontend (NEW terminal - keep backend running)
cd frontend/venturevista-ai
npm install
npm run dev

# ✓ Frontend runs on http://localhost:3000
```

### First Run
1. Open **http://localhost:3000**
2. Login with any email/password (auto-creates account)
3. Click **Evaluate** → Fill form → Click "Run AI Prediction"
4. Explore 12+ other tools from sidebar

---

## 📁 Project Structure

```
BizPredictAI/
├── backend/
│   ├── main.py          # FastAPI server (20+ endpoints)
│   ├── predictor.py     # AI prediction engine
│   └── database.py      # SQLite setup
│
├── frontend/venturevista-ai/
│   ├── app/
│   │   ├── evaluate/    # Business evaluator
│   │   ├── pitch/       # Pitch generator
│   │   ├── swot/        # SWOT analysis
│   │   ├── checklist/   # Legal checklist
│   │   ├── quiz/        # Readiness quiz
│   │   ├── trends/      # Trends dashboard
│   │   ├── api/         # Next.js API routes
│   │   └── ... (13 tools total)
│   └── globals.css      # Dark/light mode styles
│
└── README.md
```

---

## 🚀 Usage

### Evaluate a Business
```
Evaluate → City=Pune, Industry=Technology, Investment=₹5L → Run Prediction
Output: 78% success, ₹4.5L annual profit, 90% ROI, 14-month break-even
```

### Generate Pitch Deck
```
Pitch Generator → Business=FreshBite, Industry=Cloud Kitchen, Ask=₹20L
Output: 8-slide deck (Problem, Solution, Market, Model, Financials, Team, Traction, Ask)
```

### Check Legal Steps
```
Legal Checklist → Select "Cloud Kitchen"
Output: FSSAI, GST, Health License, Fire NOC, etc. with official links
```

---

## 📚 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/predict` | POST | Evaluate business & predict success |
| `/swot` | POST | Generate SWOT analysis |
| `/pitch` | POST | Generate investor pitch |
| `/namegen` | POST | Generate startup names |
| `/hotspots` | GET | Get city heatmap data |
| `/market-intelligence` | POST | Get market research |



---

## 🤝 Contributing

We welcome contributions!

1. Fork the repo
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add feature'`)
4. Push (`git push origin feature/amazing`)
5. Open Pull Request

**Areas to contribute**: More industries, mobile app, multi-language, real-time APIs, tests

---

## ⭐ Star the Repository

If this helped you, please ⭐ **star the repository**!

---

**Made with ❤️ for Indian Entrepreneurs**

🇮🇳 Proudly Made in India
