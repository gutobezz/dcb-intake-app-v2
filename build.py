#!/usr/bin/env python3
"""
DCB Intake App — Build Script
Splices intake.jsx into index.html and creates deploy.zip

Usage:
    python3 build.py

Then upload deploy.zip to Cloudflare Pages → dcbintake project → Create new deployment
"""

import zipfile
import os

def build():
    with open('index.html', 'r') as f:
        content = f.read()

    with open('intake.jsx', 'r') as f:
        jsx = f.read()

    start_tag = '<script type="text/babel" data-presets="react">\n'
    end_tag = "\n    const root = ReactDOM.createRoot(document.getElementById('root'));\n    root.render(React.createElement(window.DCBuildersIntake));\n  </script>"

    si = content.find(start_tag)
    ei = content.find(end_tag)

    if si == -1 or ei == -1:
        print("ERROR: Could not find script tags in index.html")
        return

    new_content = content[:si + len(start_tag)] + jsx + end_tag + '\n</body>\n</html>'

    with open('index.html', 'w') as f:
        f.write(new_content)

    print(f"✅ Spliced intake.jsx into index.html ({len(new_content):,} chars)")

    # Create deploy zip
    files = ['index.html', 'react.production.min.js', 'react-dom.production.min.js', 'babel.min.js']
    missing = [f for f in files if not os.path.exists(f)]
    if missing:
        print(f"⚠️  Missing files for zip: {missing}")
        print("   Deploy index.html only, or add missing JS files")
        return

    with zipfile.ZipFile('deploy.zip', 'w', zipfile.ZIP_DEFLATED) as zf:
        for f in files:
            zf.write(f)
            print(f"   + {f}")

    size = os.path.getsize('deploy.zip') / 1024
    print(f"✅ deploy.zip created ({size:.0f} KB)")
    print("   → Upload to Cloudflare Pages: dash.cloudflare.com → Pages → dcbintake → Create deployment")

if __name__ == '__main__':
    build()
