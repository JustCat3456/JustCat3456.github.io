#!/usr/bin/env python3
import os
import re
import json
import subprocess
import datetime

def get_git_creation_date(filepath):
    try:
        output = subprocess.check_output(
            ['git', 'log', '--follow', '--format=%ad', '--date=short', '--', filepath],
            text=True
        ).strip()
        if output:
            dates = [d.strip() for d in output.split('\n') if d.strip()]
            if dates:
                # Return the oldest date (first commit of this file)
                return dates[-1]
    except Exception:
        pass
    return None

def main():
    posts_dir = 'posts'
    app_js_path = 'app.js'
    
    if not os.path.exists(posts_dir):
        print(f"Error: Directory '{posts_dir}' not found.")
        return

    posts = []
    
    for filename in os.listdir(posts_dir):
        if filename.endswith('.md') and not filename.startswith('_'):
            filepath = os.path.join(posts_dir, filename)
            
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read().replace('\r\n', '\n')
            
            # Parse simple frontmatter between first and second '---'
            match = re.match(r'^---\s*\n(.*?)\n---\s*\n', content, re.DOTALL)
            title = None
            date = None
            author = "haruki saito" # Default author
            
            if match:
                frontmatter = match.group(1)
                for line in frontmatter.split('\n'):
                    if ':' in line:
                        key, val = line.split(':', 1)
                        key = key.strip().lower()
                        val = val.strip().strip('"').strip("'")
                        if key == 'title':
                            title = val
                        elif key == 'date':
                            date = val
                        elif key == 'author':
                            author = val
            
            # Fallback title: first H1 header in markdown or filename
            if not title:
                h1_match = re.search(r'^#\s+(.*)', content, re.MULTILINE)
                if h1_match:
                    title = h1_match.group(1).strip()
                else:
                    title = os.path.splitext(filename)[0]
            
            # Fallback date: oldest Git commit date, then file mtime, then today
            if not date:
                date = get_git_creation_date(filepath)
            
            if not date:
                try:
                    mtime = os.path.getmtime(filepath)
                    date = datetime.datetime.fromtimestamp(mtime).strftime('%Y-%m-%d')
                except Exception:
                    date = datetime.datetime.now().strftime('%Y-%m-%d')
            
            posts.append({
                'title': title,
                'date': date,
                'author': author,
                'fileName': filename
            })
            
    # Sort posts by date descending, then by filename
    posts.sort(key=lambda x: (x['date'], x['fileName']), reverse=True)
    
    # Generate sequential IDs
    for i, post in enumerate(posts):
        post['id'] = str(i + 1)
        
    # Format JavaScript replacement content
    lines = []
    for p in posts:
        line = f'  {{ id: "{p["id"]}", title: {json.dumps(p["title"], ensure_ascii=False)}, date: "{p["date"]}", author: {json.dumps(p["author"], ensure_ascii=False)}, fileName: "{p["fileName"]}" }},'
        lines.append(line)
        
    replacement = "const BLOG_POSTS = [\n" + "\n".join(lines) + "\n];"
    
    if not os.path.exists(app_js_path):
        print(f"Error: File '{app_js_path}' not found.")
        return
        
    with open(app_js_path, 'r', encoding='utf-8') as f:
        app_js_content = f.read()
        
    pattern = r'const BLOG_POSTS = \[\s*[\s\S]*?\s*\];'
    new_content, count = re.subn(pattern, replacement, app_js_content)
    
    if count == 0:
        print("Error: Could not locate 'const BLOG_POSTS = [...];' pattern in app.js.")
        return
        
    with open(app_js_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
        
    print(f"Successfully updated {app_js_path} with {len(posts)} posts.")

if __name__ == '__main__':
    main()
