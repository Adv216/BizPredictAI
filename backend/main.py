from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import random
import math

from database import conn, cursor
from predictor import predict_business, compare_businesses, generate_recommendations

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─── REQUEST MODELS ───────────────────────────────────────────────

class EvaluateRequest(BaseModel):
    location: str
    industry: str
    investment: int
    experience: int
    businessType: str          # product / service / franchise
    expectedCustomers: int
    riskAppetite: str = "moderate"   # conservative / moderate / aggressive
    onlineOffline: str = "offline"   # online / offline / hybrid


class SuggestRequest(BaseModel):
    location: str
    investment: int
    industry: str
    experience: int
    riskAppetite: str = "moderate"
    businessType: str = "service"
    onlineOffline: str = "offline"


class CompareRequest(BaseModel):
    location: str
    investment: int
    experience: int
    riskAppetite: str = "moderate"
    ideas: list[str]           # list of 2-3 business idea names


# ─── ROOT ─────────────────────────────────────────────────────────

@app.get("/")
def root():
    return {"message": "BizPredictAI backend running"}


# ─── PREDICT / EVALUATE ───────────────────────────────────────────

@app.post("/predict")
def predict(data: EvaluateRequest):
    result = predict_business(
        location=data.location,
        industry=data.industry,
        investment=data.investment,
        experience=data.experience,
        business_type=data.businessType,
        expected_customers=data.expectedCustomers,
        risk_appetite=data.riskAppetite,
        online_offline=data.onlineOffline,
    )

    cursor.execute("""
        INSERT INTO history
        (location, industry, investment, experience, success, profit, risk, advice,
         business_type, risk_appetite, break_even_months, roi_percent, working_capital,
         city_tier, labor_availability, rent_estimate, online_offline)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        data.location,
        data.industry,
        data.investment,
        data.experience,
        result["success"],
        result["profit"],
        result["risk"],
        result["advice"],
        data.businessType,
        data.riskAppetite,
        result["break_even_months"],
        result["roi_percent"],
        result["working_capital"],
        result["city_tier"],
        result["labor_availability"],
        result["rent_estimate"],
        data.onlineOffline,
    ))
    conn.commit()

    return result


# ─── SUGGEST IDEAS ────────────────────────────────────────────────

@app.post("/recommend")
def recommend(data: SuggestRequest):
    recs = generate_recommendations(
        location=data.location,
        investment=data.investment,
        industry=data.industry,
        experience=data.experience,
        risk_appetite=data.riskAppetite,
        business_type=data.businessType,
        online_offline=data.onlineOffline,
    )
    return {"mode": "suggest", "recommendations": recs}


# ─── COMPARE BUSINESSES ───────────────────────────────────────────

@app.post("/compare")
def compare(data: CompareRequest):
    results = compare_businesses(
        location=data.location,
        investment=data.investment,
        experience=data.experience,
        risk_appetite=data.riskAppetite,
        ideas=data.ideas,
    )
    return {"comparisons": results}


# ─── HISTORY ──────────────────────────────────────────────────────

@app.get("/history")
def get_history():
    cursor.execute("""
        SELECT location, industry, investment, experience,
               success, profit, risk, advice,
               business_type, risk_appetite, break_even_months,
               roi_percent, working_capital, city_tier,
               labor_availability, rent_estimate, online_offline,
               created_at
        FROM history
        ORDER BY id DESC
        LIMIT 50
    """)
    rows = cursor.fetchall()
    cols = [
        "location", "industry", "investment", "experience",
        "success", "profit", "risk", "advice",
        "business_type", "risk_appetite", "break_even_months",
        "roi_percent", "working_capital", "city_tier",
        "labor_availability", "rent_estimate", "online_offline",
        "created_at",
    ]
    return {"history": [dict(zip(cols, r)) for r in rows]}


# ─── HOTSPOTS MAP ─────────────────────────────────────────────────

CITY_COORDS = {
    "Mumbai":      {"lat": 19.076, "lng": 72.877, "state": "Maharashtra",   "tier": 1},
    "Delhi":       {"lat": 28.613, "lng": 77.209, "state": "Delhi",         "tier": 1},
    "Bangalore":   {"lat": 12.971, "lng": 77.594, "state": "Karnataka",     "tier": 1},
    "Hyderabad":   {"lat": 17.385, "lng": 78.486, "state": "Telangana",     "tier": 1},
    "Chennai":     {"lat": 13.083, "lng": 80.270, "state": "Tamil Nadu",    "tier": 1},
    "Pune":        {"lat": 18.520, "lng": 73.856, "state": "Maharashtra",   "tier": 1},
    "Kolkata":     {"lat": 22.573, "lng": 88.363, "state": "West Bengal",   "tier": 1},
    "Ahmedabad":   {"lat": 23.023, "lng": 72.572, "state": "Gujarat",       "tier": 1},
    "Jaipur":      {"lat": 26.912, "lng": 75.787, "state": "Rajasthan",     "tier": 2},
    "Surat":       {"lat": 21.170, "lng": 72.831, "state": "Gujarat",       "tier": 2},
    "Lucknow":     {"lat": 26.847, "lng": 80.947, "state": "Uttar Pradesh", "tier": 2},
    "Chandigarh":  {"lat": 30.733, "lng": 76.779, "state": "Punjab",        "tier": 2},
    "Indore":      {"lat": 22.719, "lng": 75.857, "state": "Madhya Pradesh","tier": 2},
    "Coimbatore":  {"lat": 11.017, "lng": 76.955, "state": "Tamil Nadu",    "tier": 2},
    "Kochi":       {"lat":  9.931, "lng": 76.267, "state": "Kerala",        "tier": 2},
    "Nagpur":      {"lat": 21.145, "lng": 79.088, "state": "Maharashtra",   "tier": 2},
    "Bhopal":      {"lat": 23.259, "lng": 77.413, "state": "Madhya Pradesh","tier": 2},
    "Visakhapatnam":{"lat":17.686,"lng": 83.218, "state": "Andhra Pradesh", "tier": 2},
    "Patna":       {"lat": 25.594, "lng": 85.137, "state": "Bihar",         "tier": 3},
    "Agra":        {"lat": 27.176, "lng": 78.008, "state": "Uttar Pradesh", "tier": 3},
}

INDUSTRY_HOTSPOTS = {
    "Technology":    ["Bangalore","Hyderabad","Pune","Chennai","Delhi","Mumbai"],
    "Manufacturing": ["Surat","Ahmedabad","Pune","Chennai","Coimbatore","Indore"],
    "Retail":        ["Mumbai","Delhi","Bangalore","Jaipur","Lucknow","Kolkata"],
    "Healthcare":    ["Chennai","Mumbai","Delhi","Hyderabad","Kochi","Kolkata"],
    "Finance":       ["Mumbai","Delhi","Bangalore","Kolkata","Ahmedabad","Chennai"],
    "Agriculture":   ["Jaipur","Lucknow","Indore","Chandigarh","Kolkata","Patna"],
    "Tourism":       ["Jaipur","Kochi","Mumbai","Delhi","Agra","Chennai"],
    "Education":     ["Delhi","Pune","Bangalore","Chennai","Lucknow","Chandigarh"],
    "Logistics":     ["Mumbai","Delhi","Surat","Ahmedabad","Kolkata","Hyderabad"],
    "Real Estate":   ["Mumbai","Bangalore","Delhi","Pune","Hyderabad","Chennai"],
}

CITY_INFRA = {
    1: {"internet": "Excellent", "roads": "Good",     "power": "Stable"},
    2: {"internet": "Good",      "roads": "Moderate", "power": "Mostly Stable"},
    3: {"internet": "Moderate",  "roads": "Fair",     "power": "Occasional Cuts"},
}

@app.get("/hotspots")
def get_hotspots(industry: str = "Technology"):
    cities = INDUSTRY_HOTSPOTS.get(industry, INDUSTRY_HOTSPOTS["Technology"])
    hotspots = []
    for city in cities:
        coords = CITY_COORDS[city]
        tier = coords["tier"]
        success = random.randint(60, 90)
        profit = random.randint(100000, 500000)
        risk = "Low" if success >= 75 else "Medium" if success >= 60 else "High"
        infra = CITY_INFRA[tier]

        # Rent estimate based on tier
        rent_ranges = {1: (80, 250), 2: (30, 80), 3: (10, 30)}
        rent_min, rent_max = rent_ranges[tier]
        rent = random.randint(rent_min, rent_max) * 1000

        # Labor availability
        labor_map = {1: "High", 2: "Moderate", 3: "Limited"}

        hotspots.append({
            "city": city,
            "state": coords["state"],
            "lat": coords["lat"],
            "lng": coords["lng"],
            "tier": tier,
            "success_rate": success,
            "avg_profit": profit,
            "risk": risk,
            "internet": infra["internet"],
            "roads": infra["roads"],
            "power": infra["power"],
            "rent_per_sqft": rent,
            "labor_availability": labor_map[tier],
        })

    return {"hotspots": hotspots}


# ─── CITY INTELLIGENCE ────────────────────────────────────────────

@app.get("/city-info")
def city_info(city: str):
    from predictor import get_city_intelligence
    return get_city_intelligence(city)


# ─── FUNDING SCHEMES ──────────────────────────────────────────────

@app.get("/funding-schemes")
def funding_schemes(investment: int, industry: str = ""):
    schemes = []

    if investment <= 1000000:
        schemes.append({
            "name": "MUDRA Yojana – Shishu",
            "max_amount": 50000,
            "description": "Loans up to ₹50,000 for micro-enterprises. No collateral required.",
            "eligibility": "New or existing micro business",
            "link": "https://www.mudra.org.in",
        })

    if investment <= 5000000:
        schemes.append({
            "name": "MUDRA Yojana – Kishor",
            "max_amount": 500000,
            "description": "Loans between ₹50,000–₹5 lakh for expanding businesses.",
            "eligibility": "Existing micro business with track record",
            "link": "https://www.mudra.org.in",
        })
        schemes.append({
            "name": "MUDRA Yojana – Tarun",
            "max_amount": 1000000,
            "description": "Loans up to ₹10 lakh for established micro-enterprises.",
            "eligibility": "Established micro business",
            "link": "https://www.mudra.org.in",
        })

    if investment <= 10000000:
        schemes.append({
            "name": "MSME Credit Guarantee Scheme (CGTMSE)",
            "max_amount": 10000000,
            "description": "Collateral-free loans up to ₹1 Cr for MSMEs through banks.",
            "eligibility": "Registered MSME",
            "link": "https://www.cgtmse.in",
        })

    if industry.lower() in ["technology", "ai", "fintech", "edtech"]:
        schemes.append({
            "name": "Startup India Seed Fund",
            "max_amount": 5000000,
            "description": "Seed funding up to ₹50 lakh for tech startups via DPIIT.",
            "eligibility": "DPIIT-recognized startup, <2 years old",
            "link": "https://seedfund.startupindia.gov.in",
        })

    schemes.append({
        "name": "Stand-Up India",
        "max_amount": 10000000,
        "description": "Bank loans of ₹10 lakh–₹1 Cr for SC/ST and women entrepreneurs.",
        "eligibility": "SC/ST or Women entrepreneur, greenfield enterprise",
        "link": "https://www.standupmitra.in",
    })

    return {"schemes": schemes}

# ─── NEW ROUTES ──────────────────────────────────────────────────

class ActionPlanRequest(BaseModel):
    industry: str
    location: str
    investment: int

class MarketIntelRequest(BaseModel):
    industry: str
    location: str

@app.post("/action-plan")
def action_plan(data: ActionPlanRequest):
    from predictor import generate_action_plan
    plan = generate_action_plan(
        industry=data.industry,
        location=data.location,
        investment=data.investment,
    )
    return plan

@app.post("/market-intelligence")
def market_intelligence(data: MarketIntelRequest):
    from predictor import get_market_intelligence
    intel = get_market_intelligence(
        industry=data.industry,
        location=data.location,
    )
    return intel


# ─── SWOT ANALYSIS ───────────────────────────────────────────────

class SwotRequest(BaseModel):
    business: str = ""
    industry: str
    location: str
    investment: int = 0
    experience: int = 0

@app.post("/swot")
def swot_analysis(data: SwotRequest):
    from predictor import predict_business, _get_industry_data, _lookup_city, _competition_label, _competition_index

    city = _lookup_city(data.location)
    ind  = _get_industry_data(data.industry)
    tier = city["tier"]
    comp = _competition_index(data.industry)
    comp_label = _competition_label(comp)
    growth_pct = int(ind["growth"] * 100)

    # Dynamic SWOT based on real predictor data
    strengths = [
        f"{'Large' if tier == 1 else 'Growing'} customer base in {data.location} with {city['literacy']}% literacy rate",
        f"Industry growth momentum at {growth_pct}% — above national average",
        f"{'Experienced founder with ' + str(data.experience) + ' years reduces execution risk' if data.experience >= 3 else 'Low entry barrier with accessible licensing and registration process'}",
        f"{'Well-capitalised at ₹' + str(data.investment // 100000) + 'L — sufficient runway' if data.investment >= ind['min_investment'] else 'Lean startup approach minimises initial burn rate'}",
    ]

    weaknesses = [
        f"{'High competition in ' + data.industry + ' (' + comp_label + ' saturation)' if comp >= 0.6 else 'Limited brand awareness in early stage for new entrants'}",
        f"{'High real estate and talent costs in Tier-1 city' if tier == 1 else 'Limited supplier ecosystem compared to metro cities'}",
        f"{'Low experience may increase time-to-profitability' if data.experience < 3 else 'Scaling beyond local market requires significant additional capital'}",
        f"{'Investment below minimum recommended for ' + data.industry if data.investment < ind['min_investment'] else 'Working capital requirements will pressure cash flow in months 3–6'}",
    ]

    opportunities = [
        f"India's {data.industry} market valued at ₹{ind['market_size_cr']:,}Cr with {growth_pct}% CAGR",
        f"Peak season in {ind['peak_season']} — plan inventory and marketing spend accordingly",
        f"Government MSME schemes (MUDRA, CGTMSE) available for businesses in this category",
        f"{'Tier-2 expansion opportunity — lower costs with growing demand' if tier == 1 else 'First-mover advantage in ' + data.location + ' before market saturates'}",
    ]

    threats = [
        f"{'Very high competitive intensity — ' + str(int(comp*100)) + '% saturation index in ' + data.industry if comp >= 0.7 else 'Established national brands may enter local market with deeper pockets'}",
        f"Rising input costs (rent, wages) — Tier-{tier} city average wages increasing 8–12% annually",
        f"Regulatory compliance burden — {data.industry} requires multiple licenses and periodic renewals",
        f"Economic slowdown risk — consumer discretionary spending contracts in slowdown periods",
    ]

    # Score based on predictor
    result = predict_business(
        location=data.location, industry=data.industry,
        investment=data.investment or ind["min_investment"],
        experience=data.experience,
    )
    score = result["success"]

    verdict = (
        f"{'Strong viability' if score >= 70 else 'Moderate viability'} for {data.business or data.industry} in {data.location}. "
        f"{'Proceed with a detailed business plan — fundamentals are aligned.' if score >= 70 else 'Address key weaknesses before full commitment, particularly capital and competition positioning.'}"
    )

    return {
        "strengths": strengths,
        "weaknesses": weaknesses,
        "opportunities": opportunities,
        "threats": threats,
        "score": score,
        "verdict": verdict,
    }


# ─── NAME GENERATOR ──────────────────────────────────────────────

class NameGenRequest(BaseModel):
    industry: str
    location: str = ""
    tone: str = "Professional"
    keywords: str = ""

@app.post("/namegen")
def name_generator(data: NameGenRequest):
    import random

    NAME_TEMPLATES = {
        "Technology":    [("NexaCore","Smart solutions, infinite scale","Nexa = next, Core = foundation","nexacore.com","Geometric hexagon with circuit lines"),("VeloTech","Built for speed, designed to scale","Velo = velocity in tech","velotech.in","Lightning bolt through a chip silhouette"),("ZenithStack","Your tech at its peak","Zenith = highest point","zenithstack.com","Mountain peak formed by stacked code brackets"),("BrightOS","Powering tomorrow's platforms","Bright = clarity + OS = operating system","brightos.io","Sun rising behind a terminal window"),("PulseLab","Where ideas become systems","Pulse = alive, Lab = innovation","pulselab.in","Heartbeat line morphing into a circuit")],
        "Food & Beverage":[("RasaBox","Bold flavours, boxed fresh","Rasa = taste/essence in Sanskrit","rasabox.in","Illustrated spice box with vibrant colors"),("ZestKitchen","Cooking made extraordinary","Zest = enthusiasm + flavour","zestkitchen.com","Lemon zest curl forming a chef's hat"),("MasalaMap","Every city, one great meal","Masala = spice blend","masalamap.in","Map pin shaped like a spice jar"),("CrispLeaf","Fresh food at your fingertips","Crisp = fresh, Leaf = natural","crispleaf.in","Leaf with fork and knife cutout"),("BhojanBox","Homestyle meals delivered hot","Bhojan = food/meal in Hindi","bhojanbox.com","Traditional tiffin box with steam swirl")],
        "Healthcare":    [("VitalArc","Connecting care, every step","Vital = life, Arc = bridge","vitalarc.in","Arc connecting two heartbeat lines"),("MediNest","Your health, our home","Nesting = safety and care","medinest.com","Nest formed by medical cross symbol"),("CuraPath","Guided healthcare journeys","Cura = care in Latin","curapath.in","Footpath leading to a heart"),("SwasthyaHub","Health intelligence for Bharat","Swasthya = health in Hindi","swasthyahub.com","Hub and spoke around medical cross"),("PulsePoint","Know your health, own it","Pulse = vitality, Point = precision","pulsepoint.in","Finger touching glowing pulse wave")],
        "default":       [("VenturePeak","Where ambition meets opportunity","Venture = enterprise, Peak = excellence","venturepeak.in","Mountain peak with upward arrow"),("KratiWorks","Building India's next chapter","Krati = progress in Sanskrit","kratiworks.com","Pen nib forming the letter K"),("UdyamPro","Professional entrepreneurship tools","Udyam = enterprise in Hindi","udyampro.in","Briefcase with circuit pattern"),("NovaBharat","New-age solutions for India","Nova = new, Bharat = India","novabharat.com","Star burst forming India map outline"),("ZenixCo","Calm execution, bold results","Zenix = zen + excellence","zenixco.in","Minimal circle with single bold stroke")],
    }

    key = "default"
    for k in NAME_TEMPLATES:
        if k.lower() in data.industry.lower() or data.industry.lower() in k.lower():
            key = k
            break

    names = NAME_TEMPLATES.get(key, NAME_TEMPLATES["default"])
    random.shuffle(names)
    selected = names[:5]

    return {"names": [
        {"name": n[0], "tagline": n[1], "meaning": n[2], "domain": n[3], "logoIdea": n[4]}
        for n in selected
    ]}


# ─── PITCH GENERATOR ─────────────────────────────────────────────

class PitchRequest(BaseModel):
    business: str
    industry: str
    location: str
    investment: int = 0
    stage: str = "Idea Stage"
    problem: str = ""

@app.post("/pitch")
def pitch_generator(data: PitchRequest):
    from predictor import predict_business, _get_industry_data, _lookup_city

    city = _lookup_city(data.location)
    ind  = _get_industry_data(data.industry)
    result = predict_business(
        location=data.location, industry=data.industry,
        investment=data.investment or ind["min_investment"],
        experience=3,
    )

    growth_pct = int(ind["growth"] * 100)
    market_cr  = ind["market_size_cr"]
    min_inv    = ind["min_investment"]
    ask        = data.investment or min_inv
    ask_l      = ask // 100000
    roi        = result["roi_percent"]
    be         = result["break_even_months"]
    profit     = result["profit"]
    tier       = city["tier"]

    problem = data.problem or f"Lack of quality, affordable {data.industry.lower()} services for the growing middle class in {data.location}"

    slides = [
        {
            "title": "The Problem",
            "content": [
                problem,
                f"The {data.industry} gap in India affects millions — particularly in Tier-{tier} cities like {data.location}",
                f"Current solutions are either too expensive, too unreliable, or completely absent for the target segment",
                f"This represents a massive unmet need in a ₹{market_cr:,}Cr market growing at {growth_pct}% annually",
            ],
            "speakerNote": f"Open with a strong, relatable story that puts the audience in the customer's shoes. Spend 60–90 seconds on this slide. The problem must be visceral and urgent."
        },
        {
            "title": "Our Solution",
            "content": [
                f"{data.business} is a {data.stage.lower()} {data.industry} venture solving this problem in {data.location}",
                f"We deliver a {'technology-enabled' if 'tech' in data.industry.lower() or 'ai' in data.industry.lower() else 'customer-first'} solution that is faster, more affordable and more reliable than existing options",
                f"Our core differentiator: local expertise combined with scalable processes built for the Indian market",
                f"We have designed specifically for {data.location}'s Tier-{tier} market dynamics — {'high competition, deep demand' if tier == 1 else 'early-mover advantage, lower costs'}",
            ],
            "speakerNote": "Demo your product here if possible. Show don't tell. Keep it to 3 core features — not a laundry list. End with one memorable line about your unfair advantage."
        },
        {
            "title": "Market Opportunity",
            "content": [
                f"Total Addressable Market (TAM): ₹{market_cr:,} Crore — India's {data.industry} sector",
                f"Serviceable Addressable Market (SAM): ₹{result['addressable_market_cr']}Cr — {data.location} and nearby region",
                f"Industry growing at {growth_pct}% CAGR — {'well above' if growth_pct > 70 else 'in line with'} national GDP growth",
                f"Peak demand in {ind['peak_season']} — with year-round baseline demand ensuring consistent revenue",
            ],
            "speakerNote": "Investors need to see you understand market sizing. Bottom-up is better than top-down. Show how you calculated SAM specifically — it builds credibility."
        },
        {
            "title": "Business Model",
            "content": [
                f"Revenue model: Direct {'subscription' if 'online' in data.industry.lower() or 'education' in data.industry.lower() else 'transaction-based'} revenue with high repeat purchase rate",
                f"Target customer: {'Businesses (B2B)' if 'marketing' in data.industry.lower() or 'logistics' in data.industry.lower() else 'Urban consumers (B2C)'} in {data.location} aged 25–45",
                f"Unit economics: Projected annual profit of ₹{profit:,} on ₹{ask:,} investment — {roi}% ROI",
                f"Break-even timeline: {be} months — {'conservative and realistic' if be <= 18 else 'achievable with disciplined execution'}",
            ],
            "speakerNote": "This is where investors focus most. Be crystal clear on how you make money per unit. If you have any early traction or pilots, mention them here."
        },
        {
            "title": "Financial Projections",
            "content": [
                f"Year 1 Target: ₹{int(profit*0.6):,} net profit — building customer base and optimising operations",
                f"Year 2 Target: ₹{int(profit*1.2):,} — reaching operational efficiency and expanding to 2nd location/channel",
                f"Year 3 Target: ₹{int(profit*2.2):,} — {'scaling to 3 cities' if tier == 1 else 'expanding to metro cities'} with proven playbook",
                f"Funding required: ₹{ask_l}L for {'product development, team, and marketing' if data.stage in ['Idea Stage','MVP Ready'] else 'scaling operations and geographic expansion'}",
            ],
            "speakerNote": "Always show a range, not a point estimate. Investors know projections are uncertain — what they're evaluating is your thinking process and assumptions."
        },
        {
            "title": "The Team",
            "content": [
                f"Founding team brings deep {data.industry} domain expertise and local market knowledge",
                f"Core team of 3–5 people covering {data.industry} operations, technology/marketing, and finance",
                f"Advisors include experienced entrepreneurs and industry veterans in {data.industry}",
                f"We are committed full-time and have skin in the game — combined personal investment of ₹{min(ask_l, 5)}L+",
            ],
            "speakerNote": "Investors bet on people first, idea second. If you have relevant past experience, highlight it specifically. If team is small, emphasise what you're hiring first with this funding."
        },
        {
            "title": "Traction & Validation",
            "content": [
                f"Stage: {data.stage} — {'building the product and validating core assumptions' if data.stage in ['Idea Stage','MVP Ready'] else 'generating revenue and refining unit economics'}",
                f"Market validation: {'Conducted 50+ customer interviews confirming the problem and willingness to pay' if data.stage == 'Idea Stage' else 'Active pilot with paying customers showing strong retention'}",
                f"Key metric focus: {'Customer Acquisition Cost and Lifetime Value ratio' if 'b2c' in data.industry.lower() else 'Monthly Recurring Revenue and churn rate'}",
                f"Next 90-day milestones: Launch in {data.location}, acquire first 100 customers, reach ₹{int(profit*0.05):,}/month revenue",
            ],
            "speakerNote": "Even at idea stage, show you've talked to real customers. Any letter of intent, waitlist signups, or pilot revenue is traction. Quantify everything."
        },
        {
            "title": "The Ask",
            "content": [
                f"Raising: ₹{ask_l} Lakh ({data.stage}) to {'build MVP and validate market' if data.stage in ['Idea Stage','MVP Ready'] else 'scale operations and expand reach'}",
                f"Use of funds: 40% operations setup, 30% team & talent, 20% marketing & customer acquisition, 10% working capital buffer",
                f"Expected runway: 18–24 months to reach profitability and Series A readiness",
                f"Investor value-add needed: {'Smart capital with mentorship and distribution network access' if data.stage in ['Idea Stage','MVP Ready'] else 'Strategic capital with connections to B2B clients or distribution partners'}",
            ],
            "speakerNote": "Be specific about the ask. Know your valuation rationale. Have a clear answer for 'what happens if you raise half this amount?' End with your vision — where is this in 5 years?"
        },
    ]

    tagline = f"{data.business} — {'Redefining' if growth_pct > 80 else 'Transforming'} {data.industry} in {data.location}"
    elevator = (
        f"We are {data.business}, a {data.stage.lower()} startup in the {data.industry} space. "
        f"{problem[:120]}{'...' if len(problem) > 120 else ''} "
        f"We're solving this with a focused, scalable approach in {data.location} — a market worth ₹{result['addressable_market_cr']}Cr locally. "
        f"We're seeking ₹{ask_l} Lakh to {'build and launch our MVP' if data.stage in ['Idea Stage','MVP Ready'] else 'scale our proven model'}. "
        f"We project ₹{profit:,} annual profit at maturity with a {roi}% ROI."
    )

    return {"slides": slides, "tagline": tagline, "elevatorPitch": elevator}
