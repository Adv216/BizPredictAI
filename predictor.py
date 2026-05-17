"""
predictor.py
Enhanced Business Intelligence Engine for BizPredictAI.
Improvements:
 - Industry×City interaction matrix for more accurate scoring
 - Competition saturation index per industry+tier
 - Seasonal demand factors
 - Investment sufficiency validation per business type
 - Founder profile composite score
 - Market size estimator
 - 90-day action plan generator
 - Market intelligence data
"""

import math
import random
from typing import Optional

# ─── CITY DATABASE ────────────────────────────────────────────────

CITY_DB = {
    "mumbai":       {"tier": 1, "state": "Maharashtra",    "pop": 12478447, "literacy": 90.28, "graduates": 1802371, "avg_wage_unskilled": 18000, "avg_wage_skilled": 45000, "languages": ["Hindi","Marathi","English"], "internet": "Excellent", "roads": "Good",     "power": "Stable",        "market_access": "Excellent", "suppliers": "Excellent", "startup_density": "Very High", "vc_presence": "High"},
    "delhi":        {"tier": 1, "state": "Delhi",          "pop": 11007835, "literacy": 87.60, "graduates": 2221137, "avg_wage_unskilled": 16000, "avg_wage_skilled": 42000, "languages": ["Hindi","Punjabi","English"],  "internet": "Excellent", "roads": "Good",     "power": "Stable",        "market_access": "Excellent", "suppliers": "Excellent", "startup_density": "Very High", "vc_presence": "High"},
    "bangalore":    {"tier": 1, "state": "Karnataka",      "pop": 8425970,  "literacy": 89.59, "graduates": 1591163, "avg_wage_unskilled": 20000, "avg_wage_skilled": 55000, "languages": ["Kannada","English","Hindi"],  "internet": "Excellent", "roads": "Moderate", "power": "Stable",        "market_access": "Excellent", "suppliers": "Excellent", "startup_density": "Extreme",  "vc_presence": "Very High"},
    "bengaluru":    {"tier": 1, "state": "Karnataka",      "pop": 8425970,  "literacy": 89.59, "graduates": 1591163, "avg_wage_unskilled": 20000, "avg_wage_skilled": 55000, "languages": ["Kannada","English","Hindi"],  "internet": "Excellent", "roads": "Moderate", "power": "Stable",        "market_access": "Excellent", "suppliers": "Excellent", "startup_density": "Extreme",  "vc_presence": "Very High"},
    "hyderabad":    {"tier": 1, "state": "Telangana",      "pop": 6809970,  "literacy": 82.96, "graduates": 1164149, "avg_wage_unskilled": 17000, "avg_wage_skilled": 48000, "languages": ["Telugu","Urdu","English"],    "internet": "Excellent", "roads": "Good",     "power": "Stable",        "market_access": "Excellent", "suppliers": "Good",      "startup_density": "High",     "vc_presence": "Moderate"},
    "chennai":      {"tier": 1, "state": "Tamil Nadu",     "pop": 7088000,  "literacy": 88.00, "graduates": 1400000, "avg_wage_unskilled": 16000, "avg_wage_skilled": 43000, "languages": ["Tamil","English"],            "internet": "Excellent", "roads": "Good",     "power": "Stable",        "market_access": "Excellent", "suppliers": "Excellent", "startup_density": "High",     "vc_presence": "Moderate"},
    "pune":         {"tier": 1, "state": "Maharashtra",    "pop": 3124458,  "literacy": 91.00, "graduates": 700000,  "avg_wage_unskilled": 17000, "avg_wage_skilled": 44000, "languages": ["Marathi","Hindi","English"],  "internet": "Excellent", "roads": "Good",     "power": "Stable",        "market_access": "Good",      "suppliers": "Good",      "startup_density": "High",     "vc_presence": "Moderate"},
    "kolkata":      {"tier": 1, "state": "West Bengal",    "pop": 4496694,  "literacy": 87.14, "graduates": 950000,  "avg_wage_unskilled": 13000, "avg_wage_skilled": 35000, "languages": ["Bengali","Hindi","English"],  "internet": "Good",      "roads": "Moderate", "power": "Mostly Stable", "market_access": "Good",      "suppliers": "Good",      "startup_density": "Moderate", "vc_presence": "Low"},
    "ahmedabad":    {"tier": 1, "state": "Gujarat",        "pop": 5570585,  "literacy": 86.65, "graduates": 900000,  "avg_wage_unskilled": 14000, "avg_wage_skilled": 38000, "languages": ["Gujarati","Hindi"],           "internet": "Good",      "roads": "Good",     "power": "Stable",        "market_access": "Good",      "suppliers": "Excellent", "startup_density": "Moderate", "vc_presence": "Low"},
    "jaipur":       {"tier": 2, "state": "Rajasthan",      "pop": 3046163,  "literacy": 79.00, "graduates": 420000,  "avg_wage_unskilled": 11000, "avg_wage_skilled": 28000, "languages": ["Hindi","Rajasthani"],         "internet": "Good",      "roads": "Good",     "power": "Mostly Stable", "market_access": "Good",      "suppliers": "Moderate",  "startup_density": "Low",      "vc_presence": "Very Low"},
    "surat":        {"tier": 2, "state": "Gujarat",        "pop": 4467797,  "literacy": 85.53, "graduates": 580000,  "avg_wage_unskilled": 13000, "avg_wage_skilled": 32000, "languages": ["Gujarati","Hindi"],           "internet": "Good",      "roads": "Moderate", "power": "Stable",        "market_access": "Good",      "suppliers": "Good",      "startup_density": "Low",      "vc_presence": "Very Low"},
    "lucknow":      {"tier": 2, "state": "Uttar Pradesh",  "pop": 2817105,  "literacy": 77.00, "graduates": 380000,  "avg_wage_unskilled": 10000, "avg_wage_skilled": 25000, "languages": ["Hindi","Urdu"],               "internet": "Good",      "roads": "Moderate", "power": "Mostly Stable", "market_access": "Moderate",  "suppliers": "Moderate",  "startup_density": "Low",      "vc_presence": "Very Low"},
    "chandigarh":   {"tier": 2, "state": "Punjab",         "pop": 960787,   "literacy": 86.05, "graduates": 180000,  "avg_wage_unskilled": 14000, "avg_wage_skilled": 35000, "languages": ["Hindi","Punjabi"],            "internet": "Good",      "roads": "Excellent","power": "Stable",        "market_access": "Moderate",  "suppliers": "Moderate",  "startup_density": "Low",      "vc_presence": "Very Low"},
    "indore":       {"tier": 2, "state": "Madhya Pradesh", "pop": 1960631,  "literacy": 82.00, "graduates": 320000,  "avg_wage_unskilled": 11000, "avg_wage_skilled": 27000, "languages": ["Hindi","Malwi"],              "internet": "Good",      "roads": "Good",     "power": "Mostly Stable", "market_access": "Moderate",  "suppliers": "Moderate",  "startup_density": "Low",      "vc_presence": "Very Low"},
    "coimbatore":   {"tier": 2, "state": "Tamil Nadu",     "pop": 1600000,  "literacy": 86.00, "graduates": 280000,  "avg_wage_unskilled": 13000, "avg_wage_skilled": 32000, "languages": ["Tamil","English"],            "internet": "Good",      "roads": "Good",     "power": "Stable",        "market_access": "Moderate",  "suppliers": "Good",      "startup_density": "Low",      "vc_presence": "Very Low"},
    "kochi":        {"tier": 2, "state": "Kerala",         "pop": 2117990,  "literacy": 97.99, "graduates": 420000,  "avg_wage_unskilled": 18000, "avg_wage_skilled": 40000, "languages": ["Malayalam","English"],        "internet": "Good",      "roads": "Good",     "power": "Stable",        "market_access": "Moderate",  "suppliers": "Moderate",  "startup_density": "Low",      "vc_presence": "Very Low"},
    "nagpur":       {"tier": 2, "state": "Maharashtra",    "pop": 2405421,  "literacy": 91.00, "graduates": 380000,  "avg_wage_unskilled": 12000, "avg_wage_skilled": 30000, "languages": ["Hindi","Marathi"],            "internet": "Good",      "roads": "Good",     "power": "Mostly Stable", "market_access": "Moderate",  "suppliers": "Moderate",  "startup_density": "Low",      "vc_presence": "Very Low"},
    "bhopal":       {"tier": 2, "state": "Madhya Pradesh", "pop": 1798218,  "literacy": 82.00, "graduates": 280000,  "avg_wage_unskilled": 10000, "avg_wage_skilled": 25000, "languages": ["Hindi"],                     "internet": "Good",      "roads": "Good",     "power": "Mostly Stable", "market_access": "Moderate",  "suppliers": "Moderate",  "startup_density": "Very Low", "vc_presence": "Very Low"},
    "visakhapatnam":{"tier": 2, "state": "Andhra Pradesh", "pop": 1728128,  "literacy": 80.00, "graduates": 260000,  "avg_wage_unskilled": 11000, "avg_wage_skilled": 28000, "languages": ["Telugu","English"],           "internet": "Good",      "roads": "Moderate", "power": "Mostly Stable", "market_access": "Moderate",  "suppliers": "Moderate",  "startup_density": "Very Low", "vc_presence": "Very Low"},
    "patna":        {"tier": 3, "state": "Bihar",          "pop": 1683200,  "literacy": 70.68, "graduates": 200000,  "avg_wage_unskilled": 8000,  "avg_wage_skilled": 20000, "languages": ["Hindi","Bhojpuri","Maithili"],"internet": "Moderate",  "roads": "Fair",     "power": "Occasional Cuts","market_access": "Low",     "suppliers": "Limited",   "startup_density": "Very Low", "vc_presence": "None"},
    "agra":         {"tier": 3, "state": "Uttar Pradesh",  "pop": 1585704,  "literacy": 71.00, "graduates": 180000,  "avg_wage_unskilled": 9000,  "avg_wage_skilled": 22000, "languages": ["Hindi","Braj Bhasha"],        "internet": "Moderate",  "roads": "Moderate", "power": "Occasional Cuts","market_access": "Low",     "suppliers": "Limited",   "startup_density": "Very Low", "vc_presence": "None"},
}

RENT_RANGES = {1: (40000, 150000), 2: (15000, 50000), 3: (5000, 18000)}

# Enhanced industry data: growth, competition, min_investment, market_size_cr
INDUSTRY_DATA = {
    "ai services":          {"growth": 0.92, "competition": 0.30, "min_investment": 200000,  "market_size_cr": 28000, "peak_season": "Q4", "trend": "rising"},
    "ev charging station":  {"growth": 0.88, "competition": 0.25, "min_investment": 1500000, "market_size_cr": 5000,  "peak_season": "All year", "trend": "rapidly rising"},
    "health diagnostics":   {"growth": 0.86, "competition": 0.55, "min_investment": 500000,  "market_size_cr": 12000, "peak_season": "All year", "trend": "rising"},
    "cloud kitchen":        {"growth": 0.85, "competition": 0.70, "min_investment": 300000,  "market_size_cr": 8000,  "peak_season": "Q1,Q3",    "trend": "rising"},
    "e-commerce logistics": {"growth": 0.84, "competition": 0.60, "min_investment": 800000,  "market_size_cr": 35000, "peak_season": "Q4",       "trend": "rising"},
    "food delivery":        {"growth": 0.83, "competition": 0.75, "min_investment": 200000,  "market_size_cr": 7500,  "peak_season": "All year", "trend": "stable-rising"},
    "solar installation":   {"growth": 0.82, "competition": 0.40, "min_investment": 500000,  "market_size_cr": 15000, "peak_season": "Q1,Q2",    "trend": "rapidly rising"},
    "online education":     {"growth": 0.80, "competition": 0.65, "min_investment": 100000,  "market_size_cr": 11000, "peak_season": "Q1,Q2",    "trend": "rising"},
    "digital marketing":    {"growth": 0.78, "competition": 0.80, "min_investment": 100000,  "market_size_cr": 9000,  "peak_season": "Q4",       "trend": "stable"},
    "pet care services":    {"growth": 0.75, "competition": 0.30, "min_investment": 150000,  "market_size_cr": 1200,  "peak_season": "All year", "trend": "rising"},
    "co-working space":     {"growth": 0.72, "competition": 0.55, "min_investment": 2000000, "market_size_cr": 4000,  "peak_season": "All year", "trend": "rising"},
    "organic grocery":      {"growth": 0.70, "competition": 0.50, "min_investment": 400000,  "market_size_cr": 3500,  "peak_season": "All year", "trend": "rising"},
    "fitness studio":       {"growth": 0.65, "competition": 0.65, "min_investment": 500000,  "market_size_cr": 4500,  "peak_season": "Q1",       "trend": "stable"},
    "mobile repair":        {"growth": 0.60, "competition": 0.85, "min_investment": 100000,  "market_size_cr": 2000,  "peak_season": "All year", "trend": "stable"},
    "technology":           {"growth": 0.85, "competition": 0.60, "min_investment": 200000,  "market_size_cr": 50000, "peak_season": "All year", "trend": "rising"},
    "food & beverage":      {"growth": 0.75, "competition": 0.75, "min_investment": 300000,  "market_size_cr": 22000, "peak_season": "Q1,Q3",    "trend": "stable"},
    "retail":               {"growth": 0.68, "competition": 0.70, "min_investment": 300000,  "market_size_cr": 18000, "peak_season": "Q4",       "trend": "stable"},
    "healthcare":           {"growth": 0.80, "competition": 0.55, "min_investment": 500000,  "market_size_cr": 30000, "peak_season": "All year", "trend": "rising"},
    "finance":              {"growth": 0.72, "competition": 0.65, "min_investment": 200000,  "market_size_cr": 45000, "peak_season": "Q4,Q1",    "trend": "stable"},
    "education":            {"growth": 0.78, "competition": 0.60, "min_investment": 200000,  "market_size_cr": 14000, "peak_season": "Q1,Q2",    "trend": "rising"},
    "manufacturing":        {"growth": 0.65, "competition": 0.50, "min_investment": 2000000, "market_size_cr": 60000, "peak_season": "All year", "trend": "stable"},
    "logistics":            {"growth": 0.80, "competition": 0.55, "min_investment": 500000,  "market_size_cr": 25000, "peak_season": "Q4",       "trend": "rising"},
    "agriculture":          {"growth": 0.62, "competition": 0.40, "min_investment": 300000,  "market_size_cr": 40000, "peak_season": "Q1,Q3",    "trend": "stable"},
    "tourism":              {"growth": 0.70, "competition": 0.60, "min_investment": 500000,  "market_size_cr": 8000,  "peak_season": "Q4,Q1",    "trend": "recovering"},
    "real estate":          {"growth": 0.68, "competition": 0.55, "min_investment": 2000000, "market_size_cr": 55000, "peak_season": "Q4",       "trend": "stable"},
}

# Industry × City tier interaction matrix (bonus/penalty to base score)
INDUSTRY_CITY_INTERACTION = {
    # (industry_key_fragment, tier): adjustment
    ("technology", 1): +8,
    ("technology", 2): +2,
    ("technology", 3): -6,
    ("ai services", 1): +12,
    ("ai services", 2): -2,
    ("ai services", 3): -10,
    ("finance", 1): +7,
    ("finance", 2): 0,
    ("finance", 3): -5,
    ("manufacturing", 1): -3,
    ("manufacturing", 2): +4,
    ("manufacturing", 3): +2,
    ("agriculture", 1): -8,
    ("agriculture", 2): -2,
    ("agriculture", 3): +6,
    ("tourism", 1): +4,
    ("tourism", 2): +2,
    ("tourism", 3): +3,
    ("cloud kitchen", 1): +6,
    ("cloud kitchen", 2): +4,
    ("cloud kitchen", 3): -2,
    ("food", 1): +3,
    ("food", 2): +3,
    ("food", 3): +2,
    ("retail", 1): +2,
    ("retail", 2): +4,
    ("retail", 3): +1,
    ("healthcare", 1): +3,
    ("healthcare", 2): +5,
    ("healthcare", 3): +4,
    ("education", 1): +2,
    ("education", 2): +4,
    ("education", 3): +3,
    ("logistics", 1): +4,
    ("logistics", 2): +6,
    ("logistics", 3): +3,
    ("ev charging", 1): +5,
    ("ev charging", 2): +3,
    ("ev charging", 3): -4,
    ("solar", 1): +2,
    ("solar", 2): +5,
    ("solar", 3): +4,
    ("fitness", 1): +5,
    ("fitness", 2): +1,
    ("fitness", 3): -4,
    ("digital marketing", 1): +6,
    ("digital marketing", 2): +2,
    ("digital marketing", 3): -4,
    ("co-working", 1): +7,
    ("co-working", 2): +1,
    ("co-working", 3): -6,
    ("pet care", 1): +6,
    ("pet care", 2): +1,
    ("pet care", 3): -5,
}

# Business ideas pool — keyed by rough industry and risk appetite
IDEA_POOL = {
    "technology": {
        "conservative": ["Mobile Repair Shop", "Computer Training Centre", "IT Support Services", "Data Entry Franchise"],
        "moderate":     ["Digital Marketing Agency", "Software Development Studio", "E-commerce Store", "Cloud Kitchen Tech Platform"],
        "aggressive":   ["AI SaaS Product", "EV Charging Network", "Health-Tech Diagnostics App", "EdTech Platform"],
    },
    "food": {
        "conservative": ["Tiffin Service", "Chai & Snacks Stall", "Bakery Shop", "Catering Service"],
        "moderate":     ["Cloud Kitchen", "Franchise Restaurant", "Organic Grocery Store", "Food Delivery Hub"],
        "aggressive":   ["QSR Chain", "D2C Food Brand", "Food-Tech Startup", "Agri-Food Processing Unit"],
    },
    "retail": {
        "conservative": ["Kirana Store", "Stationery Shop", "Mobile Accessories Store", "Second-hand Goods Store"],
        "moderate":     ["Fashion Boutique", "Electronics Retail", "Pharmacy Franchise", "Home Décor Store"],
        "aggressive":   ["D2C Brand", "Online + Offline Retail Hybrid", "Premium Lifestyle Store", "Export-Import Trading"],
    },
    "healthcare": {
        "conservative": ["Medical Store", "Diagnostic Collection Centre", "Elder Care Service", "Yoga Studio"],
        "moderate":     ["Physiotherapy Clinic", "Health Diagnostics Lab", "Wellness Centre", "Telemedicine Platform"],
        "aggressive":   ["Speciality Clinic", "Health-Tech App", "Mental Health Platform", "MedTech Device"],
    },
    "education": {
        "conservative": ["Tuition Centre", "Skill Training Institute", "Library & Study Room", "Stationery Shop"],
        "moderate":     ["Coaching Institute", "Online Course Platform", "Vocational Training Centre", "Language School"],
        "aggressive":   ["EdTech Startup", "Franchise School", "Corporate Training Company", "STEM Lab"],
    },
    "finance": {
        "conservative": ["Insurance Agency", "Tax Consultancy", "Accounting Services", "LIC Sub-Agent"],
        "moderate":     ["Mutual Fund Distributor", "Stock Advisory", "CA/CS Firm", "NBFC Partnership"],
        "aggressive":   ["FinTech App", "P2P Lending Platform", "Wealth Management Firm", "Crypto Consultancy"],
    },
    "default": {
        "conservative": ["Franchise Outlet", "Tutoring Centre", "Medical Store", "Home Services (Plumbing/Electrician)"],
        "moderate":     ["Cloud Kitchen", "Digital Marketing Agency", "E-commerce Store", "Logistics Hub"],
        "aggressive":   ["SaaS Startup", "EV Charging Station", "HealthTech Platform", "EdTech Company"],
    },
}

MUDRA_SCHEMES = [
    {"name": "MUDRA Shishu",     "max": 50000,    "note": "No collateral, up to ₹50K — ideal for micro businesses"},
    {"name": "MUDRA Kishor",     "max": 500000,   "note": "₹50K–₹5L for expanding businesses with track record"},
    {"name": "MUDRA Tarun",      "max": 1000000,  "note": "Up to ₹10L for established micro-enterprises"},
    {"name": "CGTMSE Loan",      "max": 10000000, "note": "Collateral-free up to ₹1Cr for MSMEs"},
    {"name": "Startup India Seed","max": 5000000, "note": "Up to ₹50L for DPIIT-recognised startups"},
    {"name": "Stand-Up India",   "max": 10000000, "note": "SC/ST/Women entrepreneurs — ₹10L to ₹1Cr"},
]

# 90-day plan templates per industry type
ACTION_PLAN_TEMPLATES = {
    "technology": {
        "days_1_30": [
            "Register your business as LLP or Pvt Ltd on MCA portal",
            "Open a current bank account and apply for GST registration",
            "Set up your portfolio website and LinkedIn business page",
            "Identify 10 potential clients in your city and send cold outreach emails",
            "Build MVP / prototype of your core offering",
            "Join local startup communities (NASSCOM, TiE chapters)",
        ],
        "days_31_60": [
            "Convert 2–3 outreach leads into paid pilot projects",
            "Hire 1 part-time developer or designer if needed",
            "Set up project management tools (Notion, Jira, Slack)",
            "Create content (LinkedIn, GitHub) to establish credibility",
            "Apply for any eligible MUDRA or Startup India scheme",
            "Attend 2 industry networking events",
        ],
        "days_61_90": [
            "Scale pilots to full contracts — aim for ₹1.5–3L MRR",
            "Build case studies from pilot clients",
            "Define your niche and pricing tiers clearly",
            "Explore partnerships with complementary agencies",
            "Begin hiring plan: 1 full-time hire by month 4",
            "Review unit economics and adjust pricing if needed",
        ],
    },
    "food": {
        "days_1_30": [
            "Register FSSAI license (mandatory for all food businesses)",
            "Finalise kitchen space — cloud kitchen or commercial unit",
            "Source 3 reliable raw material vendors and negotiate credit terms",
            "Design your menu and determine COGS for each item",
            "Create Swiggy/Zomato business accounts if online",
            "Get health & safety inspection clearance from local municipal body",
        ],
        "days_31_60": [
            "Do a soft launch with 50% discount for first 100 orders",
            "Collect customer feedback daily and iterate menu",
            "Run targeted Instagram ads in a 5km radius",
            "Aim for 30+ orders/day by week 6",
            "Set up proper inventory management to reduce wastage below 8%",
            "Hire 1–2 kitchen staff and a delivery coordinator",
        ],
        "days_61_90": [
            "Optimise bestsellers and discontinue slow-moving items",
            "Aim for 60–80 orders/day and stable 4.2+ rating on platforms",
            "Introduce weekly specials or combo deals to increase AOV",
            "Explore catering tie-ups with nearby offices or colleges",
            "Review food cost percentage — target below 30%",
            "Plan for second kitchen or expansion if capacity is maxed",
        ],
    },
    "retail": {
        "days_1_30": [
            "Finalise shop location (high foot traffic, visibility)",
            "Obtain Shop & Establishment Act registration",
            "Negotiate rent — aim for 3-month free fit-out period",
            "Set up GST and point-of-sale billing system",
            "Source 5–7 product categories from wholesale markets",
            "Design store layout for maximum product visibility",
        ],
        "days_31_60": [
            "Grand opening with launch offer (10–15% off first purchase)",
            "Set up WhatsApp Business for repeat customer orders",
            "Track daily footfall and conversion rate",
            "Create Google My Business listing with photos",
            "Join local traders' association for networking",
            "Aim for ₹80K–1.5L revenue in first month",
        ],
        "days_61_90": [
            "Introduce loyalty card or referral discount scheme",
            "Identify top 20% products contributing 80% of revenue",
            "Reduce slow-moving inventory via promotional sales",
            "Explore supplier credit extension from 30 to 60 days",
            "Add 1–2 complementary product categories",
            "Review monthly P&L and adjust procurement accordingly",
        ],
    },
    "healthcare": {
        "days_1_30": [
            "Obtain PCPNDT, Clinical Establishment Act & NABH pre-accreditation",
            "Finalise clinic / lab location near hospital cluster or residential area",
            "Hire qualified staff (doctor/technician) as per MCI/DCI norms",
            "Install required medical equipment — check AERB compliance if applicable",
            "Set up patient management software (Practo, Lybrate)",
            "Empanel with 2–3 insurance companies (Star Health, HDFC ERGO)",
        ],
        "days_31_60": [
            "Run awareness campaign in nearby housing societies and offices",
            "Tie up with 3–5 referral doctors for patient flow",
            "List on Practo and Google Maps with complete profile",
            "Target 20–30 patients/day footfall by end of month 2",
            "Set up emergency protocols and staff training",
            "Apply for AYUSH or CGHS empanelment if eligible",
        ],
        "days_61_90": [
            "Launch health camp or free screening day for community visibility",
            "Analyse which services generate highest margin and promote them",
            "Add home collection or tele-consultation to increase reach",
            "Aim for 60–80% equipment utilisation",
            "Build patient retention: follow-up calls, health reminders",
            "Explore corporate health package tie-ups with nearby companies",
        ],
    },
    "default": {
        "days_1_30": [
            "Register your business entity and obtain GST number",
            "Open a dedicated business current account",
            "Create a professional website and social media profiles",
            "Identify your target customer segment and map competitors",
            "Finalise your pricing strategy and unit economics",
            "Reach out to 20 potential customers for early feedback",
        ],
        "days_31_60": [
            "Launch your product/service to initial customers",
            "Collect NPS feedback and iterate quickly",
            "Set up accounting software (Zoho Books / Tally)",
            "Hire 1 key team member if budget allows",
            "Establish 2–3 reliable supplier/vendor relationships",
            "Apply for eligible government schemes (MUDRA, CGTMSE)",
        ],
        "days_61_90": [
            "Analyse which customer segments convert best",
            "Double down on your top-performing acquisition channel",
            "Introduce referral programme for word-of-mouth growth",
            "Review and optimise your cost structure monthly",
            "Attend 2 industry events or trade fairs",
            "Set 6-month targets for revenue, customers and team size",
        ],
    },
}

# Market intelligence per industry
MARKET_INTEL = {
    "technology": {
        "target_audience": "B2B: SMEs, startups, corporates. B2C: professionals, students",
        "avg_customer_ltv": "₹50,000–₹5,00,000/year per client",
        "top_competitors": ["Infosys BPM", "TCS iON", "Wipro", "Local agencies"],
        "acquisition_channels": ["LinkedIn outreach", "Referrals", "Content marketing", "Events"],
        "key_risks": ["Talent attrition", "Rapid tech obsolescence", "Price competition from freelancers"],
        "differentiators": ["Niche specialisation", "Faster turnaround", "Local support"],
        "regulatory": ["IT Act 2000 compliance", "GDPR for global clients", "Data localisation norms"],
    },
    "food": {
        "target_audience": "Urban millennials, working professionals, families aged 25–45",
        "avg_customer_ltv": "₹800–₹2,500/month per repeat customer",
        "top_competitors": ["Swiggy Cloud Kitchen brands", "Zomato Kitchen", "Local restaurants"],
        "acquisition_channels": ["Swiggy/Zomato listing", "Instagram ads", "Google My Business", "Word of mouth"],
        "key_risks": ["Food spoilage (8–12% wastage)", "Platform commission (25–30%)", "Labour turnover"],
        "differentiators": ["Unique cuisine / fusion", "Speed of delivery", "Hygiene certification"],
        "regulatory": ["FSSAI license mandatory", "Municipal health certificate", "Fire NOC for kitchen"],
    },
    "healthcare": {
        "target_audience": "General population, corporates for health packages, senior citizens",
        "avg_customer_ltv": "₹5,000–₹20,000/year per patient",
        "top_competitors": ["Metropolis", "Dr Lal PathLabs", "SRL Diagnostics", "Local clinics"],
        "acquisition_channels": ["Doctor referrals", "Insurance empanelment", "Practo listing", "Community camps"],
        "key_risks": ["Regulatory compliance burden", "High capital for equipment", "Staff certification requirements"],
        "differentiators": ["Home collection service", "Fast turnaround time (reports in 4hrs)", "Insurance tie-ups"],
        "regulatory": ["Clinical Establishment Act registration", "PCPNDT for radiology", "NABH accreditation"],
    },
    "retail": {
        "target_audience": "Local households, walk-in customers, nearby office workers",
        "avg_customer_ltv": "₹2,000–₹8,000/month per regular customer",
        "top_competitors": ["D-Mart", "Reliance Retail", "Local kirana stores", "Amazon/Flipkart"],
        "acquisition_channels": ["Foot traffic", "WhatsApp groups", "Pamphlets", "Google Maps listing"],
        "key_risks": ["Inventory overstocking", "E-commerce competition", "Thin margins in FMCG"],
        "differentiators": ["Personalised service", "Credit facility for regulars", "Home delivery in 2km radius"],
        "regulatory": ["Shop & Establishment Act", "GST registration", "FSSAI if food items"],
    },
    "default": {
        "target_audience": "Local businesses and consumers in your city",
        "avg_customer_ltv": "₹10,000–₹50,000/year",
        "top_competitors": ["Established local players", "National chains", "Online alternatives"],
        "acquisition_channels": ["Digital marketing", "Word of mouth", "Local advertising", "Partnerships"],
        "key_risks": ["Market saturation", "Capital constraints", "Competition from established brands"],
        "differentiators": ["Personalised service", "Local expertise", "Competitive pricing"],
        "regulatory": ["GST registration", "MSME registration", "Local municipal permits"],
    },
}


# ─── UTILITY HELPERS ──────────────────────────────────────────────

def _lookup_city(city: str) -> dict:
    key = city.strip().lower()
    return CITY_DB.get(key, {
        "tier": 2, "state": "India", "pop": 1000000,
        "literacy": 80.0, "graduates": 200000,
        "avg_wage_unskilled": 12000, "avg_wage_skilled": 30000,
        "languages": ["Hindi"],
        "internet": "Good", "roads": "Moderate", "power": "Mostly Stable",
        "market_access": "Moderate", "suppliers": "Moderate",
        "startup_density": "Low", "vc_presence": "Very Low",
    })


def _get_industry_data(industry: str) -> dict:
    key = industry.strip().lower()
    for k, v in INDUSTRY_DATA.items():
        if k in key or key in k:
            return v
    return {"growth": 0.68, "competition": 0.60, "min_investment": 200000, "market_size_cr": 5000, "peak_season": "All year", "trend": "stable"}


def _growth_rate(industry: str) -> float:
    return _get_industry_data(industry)["growth"]


def _competition_index(industry: str) -> float:
    return _get_industry_data(industry)["competition"]


def _tier_multiplier(tier: int) -> float:
    return {1: 1.18, 2: 1.00, 3: 0.84}[tier]


def _experience_bonus(exp: int) -> float:
    # More granular experience curve
    if exp == 0:   return -6
    elif exp == 1: return -2
    elif exp == 2: return 2
    elif exp == 3: return 5
    elif exp <= 5: return 8
    elif exp <= 8: return 12
    elif exp <= 12:return 16
    else:          return 20


def _risk_appetite_multiplier(risk: str) -> float:
    return {"conservative": 0.88, "moderate": 1.0, "aggressive": 1.12}.get(risk.lower(), 1.0)


def _online_bonus(online_offline: str) -> int:
    return {"online": 9, "hybrid": 5, "offline": 0}.get(online_offline.lower(), 0)


def _investment_score(investment: int, min_required: int) -> float:
    """Score capital adequacy: penalise if underfunded, reward if well-capitalised."""
    if investment <= 0:
        return -10
    ratio = investment / max(min_required, 1)
    if ratio < 0.5:
        return -8   # severely underfunded
    elif ratio < 0.8:
        return -3   # underfunded
    elif ratio < 1.2:
        return min(15, math.log10(investment) * 4)
    else:
        return min(22, math.log10(investment) * 5)  # well-funded


def _competition_penalty(industry: str, tier: int) -> float:
    """High competition in saturated markets → success penalty."""
    comp = _competition_index(industry)
    # Tier-1 has more competition than tier-3
    tier_competition_boost = {1: 0.08, 2: 0.0, 3: -0.05}[tier]
    effective_comp = min(0.95, comp + tier_competition_boost)
    return -(effective_comp * 12)  # max -11.4 penalty


def _city_industry_bonus(industry: str, tier: int) -> float:
    """Look up industry×city interaction matrix."""
    ind_lower = industry.strip().lower()
    for (ind_key, t), bonus in INDUSTRY_CITY_INTERACTION.items():
        if t == tier and (ind_key in ind_lower or ind_lower in ind_key):
            return float(bonus)
    return 0.0


def _get_rent(tier: int) -> int:
    lo, hi = RENT_RANGES[tier]
    return random.randint(lo, hi)


def _labor_availability(tier: int) -> str:
    return {1: "High", 2: "Moderate", 3: "Limited"}[tier]


def _eligible_schemes(investment: int) -> list:
    return [s for s in MUDRA_SCHEMES if investment <= s["max"] * 2]


def _founder_composite_score(experience: int, risk_appetite: str, online_offline: str) -> float:
    """Composite founder readiness score 0–100."""
    exp_score = min(40, experience * 4)
    risk_score = {"conservative": 20, "moderate": 25, "aggressive": 22}.get(risk_appetite.lower(), 20)
    channel_score = {"online": 15, "hybrid": 12, "offline": 8}.get(online_offline.lower(), 8)
    return min(95, 20 + exp_score + risk_score + channel_score)


def _market_size_addressable(industry: str, tier: int, investment: int) -> int:
    """Estimate addressable market in ₹ crores for this business."""
    data = _get_industry_data(industry)
    base = data["market_size_cr"]
    tier_share = {1: 0.12, 2: 0.06, 3: 0.02}[tier]
    scale = min(1.0, investment / 2000000)  # larger investment → larger addressable market
    return int(base * tier_share * (0.3 + scale * 0.7))


# ─── MAIN PREDICTION ENGINE ───────────────────────────────────────

def predict_business(
    location: str,
    industry: str,
    investment: int,
    experience: int,
    business_type: str = "service",
    expected_customers: int = 100,
    risk_appetite: str = "moderate",
    online_offline: str = "offline",
) -> dict:

    city = _lookup_city(location)
    tier = city["tier"]
    growth = _growth_rate(industry)
    ind_data = _get_industry_data(industry)

    # ── Enhanced Base success score ──
    base = 42.0
    base += growth * 22                                          # industry momentum
    base += _investment_score(investment, ind_data["min_investment"])  # capital adequacy (vs minimum required)
    base += _experience_bonus(experience)                        # founder experience (granular)
    base += _online_bonus(online_offline)                        # digital reach bonus
    base += (city["literacy"] / 100) * 8                        # educated customer base
    base += _city_industry_bonus(industry, tier)                 # industry×city interaction
    base += _competition_penalty(industry, tier)                 # competition saturation penalty
    base *= _tier_multiplier(tier)                              # city tier multiplier
    base *= _risk_appetite_multiplier(risk_appetite)            # risk appetite adjustment

    # Clamp with industry-specific ceiling (high-competition industries cap lower)
    max_success = int(96 - (_competition_index(industry) * 15))
    success = int(min(max_success, max(22, base + random.uniform(-3, 3))))

    # ── Risk level ──
    if success >= 74:
        risk = "Low"
    elif success >= 54:
        risk = "Medium"
    else:
        risk = "High"

    # ── Financial projections ──
    margin_map = {"service": 0.35, "product": 0.22, "franchise": 0.18}
    margin = margin_map.get(business_type.lower(), 0.28)

    # Competition reduces effective margin
    comp_margin_factor = 1.0 - (_competition_index(industry) * 0.25)
    annual_profit = int(
        investment * margin * growth * _tier_multiplier(tier)
        * comp_margin_factor * random.uniform(0.88, 1.12)
    )
    monthly_profit = max(1, annual_profit // 12)

    # ROI
    roi_percent = round((annual_profit / investment) * 100, 1) if investment > 0 else 0

    # Break-even (enhanced: accounts for working capital burn)
    break_even_months = int(math.ceil(investment / monthly_profit)) if monthly_profit > 0 else 36
    break_even_months = max(1, min(break_even_months, 72))

    # Working capital
    rent = _get_rent(tier)
    wages_unskilled = city["avg_wage_unskilled"]
    wages_skilled   = city["avg_wage_skilled"]
    working_capital = rent + (wages_unskilled * 2) + (wages_skilled * 1) + int(investment * 0.05)

    # ── Market metrics ──
    addressable_market = _market_size_addressable(industry, tier, investment)
    founder_score = _founder_composite_score(experience, risk_appetite, online_offline)

    # ── Advice ──
    advice = _generate_advice(
        success=success, risk=risk, city=city, industry=industry,
        investment=investment, experience=experience,
        break_even_months=break_even_months, roi_percent=roi_percent,
        risk_appetite=risk_appetite, online_offline=online_offline,
        competition=_competition_index(industry),
    )

    # ── Funding options ──
    schemes = _eligible_schemes(investment)

    # ── Enhanced Scorecard ──
    scorecard = {
        "market_potential":   min(95, int(growth * 95 + tier * 3)),
        "competition_risk":   int(_competition_index(industry) * 100),
        "profit_outlook":     min(95, int(roi_percent * 2.2)),
        "financial_risk":     max(10, 100 - success),
        "city_readiness":     _city_readiness_score(city),
        "founder_fit":        int(founder_score),
    }

    return {
        "success":            success,
        "profit":             annual_profit,
        "monthly_profit":     monthly_profit,
        "risk":               risk,
        "roi_percent":        roi_percent,
        "break_even_months":  break_even_months,
        "working_capital":    working_capital,
        "rent_estimate":      rent,
        "city_tier":          tier,
        "city_state":         city["state"],
        "labor_availability": _labor_availability(tier),
        "avg_wage_unskilled": city["avg_wage_unskilled"],
        "avg_wage_skilled":   city["avg_wage_skilled"],
        "languages":          city["languages"],
        "internet":           city["internet"],
        "roads":              city["roads"],
        "power":              city["power"],
        "market_access":      city["market_access"],
        "suppliers":          city["suppliers"],
        "literacy_rate":      city["literacy"],
        "population":         city["pop"],
        "startup_density":    city.get("startup_density", "Moderate"),
        "vc_presence":        city.get("vc_presence", "Low"),
        "eligible_schemes":   schemes,
        "scorecard":          scorecard,
        "advice":             advice,
        "addressable_market_cr": addressable_market,
        "founder_score":      int(founder_score),
        "competition_level":  _competition_label(_competition_index(industry)),
        "industry_trend":     ind_data["trend"],
        "peak_season":        ind_data["peak_season"],
        "min_investment_required": ind_data["min_investment"],
    }


def _competition_label(comp: float) -> str:
    if comp >= 0.80: return "Very High"
    elif comp >= 0.65: return "High"
    elif comp >= 0.50: return "Moderate"
    elif comp >= 0.35: return "Low"
    else: return "Very Low"


# ─── ADVICE GENERATOR (ENHANCED) ─────────────────────────────────

def _generate_advice(
    success, risk, city, industry, investment, experience,
    break_even_months, roi_percent, risk_appetite, online_offline, competition
) -> str:
    tier = city["tier"]
    parts = []

    if success >= 74:
        parts.append(f"Strong fundamentals — {industry} in a Tier-{tier} city shows excellent market alignment.")
    elif success >= 54:
        parts.append(f"Moderate potential for {industry} here. Success is achievable with disciplined execution.")
    else:
        parts.append(f"High risk detected for {industry} in this location. Consider pivoting your industry or city choice.")

    if competition >= 0.75:
        parts.append(f"This market is highly saturated — differentiation through a niche, superior service, or digital-first approach is critical to stand out.")
    elif competition <= 0.35:
        parts.append(f"Low competition presents a first-mover opportunity. Move fast to capture market share before saturation.")

    if experience == 0:
        parts.append("As a first-time entrepreneur, strongly consider a franchise or mentor-backed model to reduce execution risk.")
    elif experience < 3:
        parts.append("Build your local network early — industry associations can significantly lower your customer acquisition cost.")
    elif experience >= 8:
        parts.append("Your experience is a strong asset — leverage it to build credibility through case studies and referrals from Day 1.")

    if break_even_months > 24:
        parts.append(f"Break-even at {break_even_months} months is stretched — ensure 6–9 months of runway capital beyond your initial investment.")
    else:
        parts.append(f"Break-even in ~{break_even_months} months is healthy. Focus on unit economics from Day 1 to maintain this pace.")

    if tier == 1:
        parts.append("Tier-1 city offers deep talent pools and investor access, but rent and wage costs are high — keep fixed costs lean in year one.")
    elif tier == 2:
        parts.append("Tier-2 cities offer lower operating costs with rapidly growing demand — an excellent window for early-mover advantage.")
    else:
        parts.append("Tier-3 markets have untapped demand but limited infrastructure. Keep your supply chain simple and team small.")

    if online_offline == "online":
        parts.append("Going online expands your reach nationally. Invest in SEO, Google Ads, and a conversion-optimised website from the start.")
    elif online_offline == "hybrid":
        parts.append("A hybrid model balances local trust with digital reach — the most resilient setup for current market conditions.")

    if roi_percent > 30:
        parts.append(f"Projected ROI of {roi_percent}% is above industry average — reinvest early profits to compound growth.")
    elif roi_percent < 12:
        parts.append("ROI is below market average. Explore reducing fixed costs via shared spaces, outsourcing non-core tasks, or increasing ticket size.")

    return " ".join(parts)


def _city_readiness_score(city: dict) -> int:
    score = 0
    score += {"Excellent": 25, "Good": 20, "Moderate": 13, "Fair": 8, "Limited": 4}.get(city["internet"], 10)
    score += {"Excellent": 25, "Good": 20, "Moderate": 13, "Fair": 8}.get(city["roads"], 10)
    score += {"Stable": 25, "Mostly Stable": 18, "Occasional Cuts": 10}.get(city["power"], 10)
    score += {"Excellent": 25, "Good": 20, "Moderate": 13, "Low": 8, "Limited": 4}.get(city["market_access"], 10)
    return min(100, score)


# ─── CITY INTELLIGENCE ────────────────────────────────────────────

def get_city_intelligence(city_name: str) -> dict:
    city = _lookup_city(city_name)
    tier = city["tier"]
    rent_lo, rent_hi = RENT_RANGES[tier]
    return {
        "city": city_name, "state": city["state"], "tier": tier,
        "population": city["pop"], "literacy_rate": city["literacy"],
        "graduates": city["graduates"], "languages": city["languages"],
        "infrastructure": {"internet": city["internet"], "roads": city["roads"], "power": city["power"]},
        "market_access": city["market_access"], "suppliers": city["suppliers"],
        "startup_density": city.get("startup_density", "Moderate"),
        "vc_presence": city.get("vc_presence", "Low"),
        "labor": {"availability": _labor_availability(tier), "avg_wage_unskilled": city["avg_wage_unskilled"], "avg_wage_skilled": city["avg_wage_skilled"]},
        "property": {"rent_range_monthly": f"₹{rent_lo:,}–₹{rent_hi:,} (500 sqft commercial)"},
        "readiness_score": _city_readiness_score(city),
    }


# ─── 90-DAY ACTION PLAN ───────────────────────────────────────────

def generate_action_plan(industry: str, location: str, investment: int) -> dict:
    city = _lookup_city(location)
    ind_lower = industry.strip().lower()
    template_key = "default"
    for key in ACTION_PLAN_TEMPLATES:
        if key in ind_lower or ind_lower in key:
            template_key = key
            break
    plan = ACTION_PLAN_TEMPLATES[template_key]
    ind_data = _get_industry_data(industry)
    return {
        "industry": industry,
        "location": location,
        "investment": investment,
        "days_1_30":  plan["days_1_30"],
        "days_31_60": plan["days_31_60"],
        "days_61_90": plan["days_61_90"],
        "key_milestone_30":  f"Business registered, at least 5 paying customers or clients contacted",
        "key_milestone_60":  f"First revenue — target ₹{int(investment * 0.05):,} in month 2",
        "key_milestone_90":  f"Sustainable operations — target ₹{int(investment * 0.12):,}/month revenue run-rate",
        "peak_season":       ind_data["peak_season"],
        "competition_level": _competition_label(ind_data["competition"]),
    }


# ─── MARKET INTELLIGENCE ──────────────────────────────────────────

def get_market_intelligence(industry: str, location: str) -> dict:
    city = _lookup_city(location)
    tier = city["tier"]
    ind_data = _get_industry_data(industry)
    ind_lower = industry.strip().lower()

    intel_key = "default"
    for key in MARKET_INTEL:
        if key in ind_lower or ind_lower in key:
            intel_key = key
            break

    intel = MARKET_INTEL[intel_key]
    addressable = _market_size_addressable(industry, tier, 1000000)

    return {
        "industry":            industry,
        "location":            location,
        "city_tier":           tier,
        "growth_rate_pct":     int(ind_data["growth"] * 100),
        "competition_level":   _competition_label(ind_data["competition"]),
        "competition_score":   int(ind_data["competition"] * 100),
        "market_size_cr":      ind_data["market_size_cr"],
        "addressable_market_cr": addressable,
        "industry_trend":      ind_data["trend"],
        "peak_season":         ind_data["peak_season"],
        "target_audience":     intel["target_audience"],
        "avg_customer_ltv":    intel["avg_customer_ltv"],
        "top_competitors":     intel["top_competitors"],
        "acquisition_channels":intel["acquisition_channels"],
        "key_risks":           intel["key_risks"],
        "differentiators":     intel["differentiators"],
        "regulatory":          intel["regulatory"],
        "startup_density":     city.get("startup_density", "Moderate"),
        "vc_presence":         city.get("vc_presence", "Low"),
    }


# ─── RECOMMENDATION ENGINE ────────────────────────────────────────

def generate_recommendations(
    location: str, investment: int, industry: str, experience: int,
    risk_appetite: str = "moderate", business_type: str = "service", online_offline: str = "offline",
) -> list[dict]:
    industry_key = industry.strip().lower()
    matched_key = "default"
    for k in IDEA_POOL:
        if k in industry_key or industry_key in k:
            matched_key = k
            break
    pool = IDEA_POOL[matched_key].get(risk_appetite.lower(), IDEA_POOL[matched_key]["moderate"])
    ideas = random.sample(pool, min(4, len(pool)))

    results = []
    for idea in ideas:
        pred = predict_business(
            location=location, industry=idea, investment=investment, experience=experience,
            business_type=business_type, risk_appetite=risk_appetite, online_offline=online_offline,
        )
        results.append({
            "idea": idea, "success": pred["success"], "risk": pred["risk"],
            "roi_percent": pred["roi_percent"], "break_even_months": pred["break_even_months"],
            "annual_profit": pred["profit"], "working_capital": pred["working_capital"],
            "advice": pred["advice"], "scorecard": pred["scorecard"],
            "eligible_schemes": pred["eligible_schemes"],
            "competition_level": pred["competition_level"],
            "industry_trend": pred["industry_trend"],
        })

    results.sort(key=lambda x: x["success"], reverse=True)
    return results


# ─── COMPARISON ENGINE ────────────────────────────────────────────

def compare_businesses(
    location: str, investment: int, experience: int, risk_appetite: str, ideas: list[str],
) -> list[dict]:
    results = []
    for idea in ideas[:3]:
        pred = predict_business(
            location=location, industry=idea, investment=investment,
            experience=experience, risk_appetite=risk_appetite,
        )
        results.append({
            "idea": idea, "success": pred["success"], "profit": pred["profit"],
            "roi_percent": pred["roi_percent"], "break_even_months": pred["break_even_months"],
            "risk": pred["risk"], "working_capital": pred["working_capital"],
            "city_tier": pred["city_tier"], "scorecard": pred["scorecard"],
            "advice": pred["advice"], "competition_level": pred["competition_level"],
            "industry_trend": pred["industry_trend"],
            "founder_score": pred["founder_score"],
        })
    results.sort(key=lambda x: x["success"], reverse=True)
    for i, r in enumerate(results):
        r["rank"] = i + 1
    return results