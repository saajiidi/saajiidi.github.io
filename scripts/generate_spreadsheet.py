import pandas as pd

# Define the data for each sheet
data_info = {
    'Key': ['Name', 'Role', 'HeroText', 'Github', 'Linkedin', 'Kaggle', 'Whatsapp'],
    'Value': [
        'Sajid Islam',
        'Data Scientist & Business Analyst',
        'A Data & Business Analyst specialized in turning complex datasets into strategic growth. Based in Bangladesh, I lead data-ops at DEEN Commerce.',
        'https://github.com/saajiidi',
        'https://www.linkedin.com/in/sajidislamchowdhury/',
        'https://www.kaggle.com/saajiidi',
        '+880 182 452 6054'
    ]
}

data_experience = {
    'Role': ['Executive — Business', 'Co-Founder', 'Marketplace Analyst'],
    'Company': ['DEEN Commerce', 'Gear Master', 'Daraz (Alibaba Group)'],
    'Date': ['Jan 2025 — Present', 'Jun 2024 — Present', 'Jan 2020 — Jan 2022'],
    'Bullet1': [
        'Leading Business Strategy and CRM growth.',
        'Leading Business Operations for bike accessories retail.',
        'Optimized Marketplace Health through performance tracking.'
    ],
    'Bullet2': [
        'Architecting weekly performance dashboards.',
        'Managing inventory and multi-channel engagement.',
        'Leveraged BI tools for food trends and demand spikes.'
    ],
    'Category': ['active', 'active', 'history']
}

data_education = {
    'Institution': ['Academy of Business Professionals', 'North South University'],
    'Degree': ['PGD - Data Science & Business Analytics', 'BSc - Computer Science & Engineering'],
    'Date': ['2025', '2019']
}

data_skills = {
    'Skill': ['Python', 'SQL', 'BI Tools', 'ML', 'Web Dev', 'Marketing'],
    'Value': [90, 85, 95, 70, 75, 80],
    'Category': ['core', 'core', 'tools', 'core', 'tools', 'tools']
}

data_projects = {
    'Title': ['E-COMM_BI_DASHBOARD', 'CUSTOMER_CHURN_ML', 'BORDER_KILLING_TREND'],
    'Description': [
        'Tracking BDT 127M+ revenue.',
        'XGBoost implementation.',
        'Trend analysis visualization.'
    ],
    'Problem': [
        'Sales visibility was scattered.',
        'Churn signals were hidden.',
        'Incident trends were hard to interpret.'
    ],
    'Approach': [
        'Built real-time KPIs in Power BI.',
        'Trained ML models with feature engineering.',
        'Cleaned records and built trend views.'
    ],
    'Impact': [
        'Tracking BDT 127M+ revenue.',
        '85%+ accuracy.',
        'Clear historical view.'
    ],
    'Tools': ['Power BI, SQL', 'Python, sklearn', 'Python, Viz'],
    'Category': ['bi-viz', 'ml-ai', 'bi-viz'],
    'Link': [
        'https://e-com-dashborad.vercel.app/',
        'https://github.com/saajiidi/Customer-Churn-Prediction/',
        'https://saajiidi.github.io/Border-Killing-Trend-in-Bangladesh/'
    ]
}

data_awards = {
    'Title': ['ICT4SD Research Contribution', 'Professional Certifications'],
    'Subheading': ['Data Mining Techniques Publication', 'Data Science Credentials'],
    'Date': ['Dec 2020', '2024'],
    'Link': [
        'https://ict4sd.org/link/proceedings/ICT4SD-2020-VOL2.pdf',
        'https://drive.google.com/file/d/1cJxcJJur1n3MiXFETv5k30SDP0WP9wOm/view'
    ]
}

# Create a multi-sheet Excel file
file_name = 'PortfolioData.xlsx'

with pd.ExcelWriter(file_name, engine='openpyxl') as writer:
    pd.DataFrame(data_info).to_excel(writer, sheet_name='Info', index=False)
    pd.DataFrame(data_experience).to_excel(writer, sheet_name='Experience', index=False)
    pd.DataFrame(data_education).to_excel(writer, sheet_name='Education', index=False)
    pd.DataFrame(data_skills).to_excel(writer, sheet_name='Skills', index=False)
    pd.DataFrame(data_projects).to_excel(writer, sheet_name='Projects', index=False)
    pd.DataFrame(data_awards).to_excel(writer, sheet_name='Awards', index=False)

print(f"Excel file created: {file_name}")
