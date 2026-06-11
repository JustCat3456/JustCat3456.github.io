import React, { useState, useRef, useEffect } from 'react';
import { blogPostsMetadata } from './Blog';

export default function Terminal() {
  const [history, setHistory] = useState([
    { text: 'RetroOS Terminal v1.80 [BBS Client Mode]', type: 'muted' },
    { text: "Type 'help' to list available commands.", type: 'muted' },
    { text: 'Guest node connected from remote host...', type: 'normal' },
    { text: 'Welcome! Please type your name to leave a message.', type: 'normal' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const outputEndRef = useRef(null);

  const appendLine = (text, type = 'normal') => {
    setHistory(prev => [...prev, { text, type }]);
  };

  useEffect(() => {
    if (outputEndRef.current) {
      outputEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const query = inputValue.trim();
    if (!query) return;

    appendLine(`> ${query}`, 'user-query');
    setInputValue('');

    const cmd = query.toLowerCase().split(/\s+/)[0];
    const args = query.trim().split(/\s+/);

    parseCommand(cmd, query, args);
  };

  const parseCommand = (cmd, originalQuery, args) => {
    if (cmd === 'help') {
      appendLine('Available commands:');
      appendLine('  about    - Show profile summary', 'accent');
      appendLine('  projects - List recent creative archives', 'accent');
      appendLine('  blog     - List recent blog posts', 'accent');
      appendLine('  blog [id]- View blog post details (e.g. blog 1)', 'accent');
      appendLine('  contact  - Instructions to send mail', 'accent');
      appendLine('  clear    - Clear the screen', 'accent');
      appendLine('  mail [msg]- Simulate sending a message to administrator', 'accent');
    } 
    else if (cmd === 'about') {
      appendLine('--- JustCat (Hauki Saito) ---');
      appendLine('Geoscience B3 student at University of the Ryukyus.');
      appendLine('Passionate about programming and earth sciences.');
      appendLine('Skills: Java, HTML/CSS, Vanilla JavaScript.');
    } 
    else if (cmd === 'projects') {
      appendLine('--- Creative Archives ---');
      appendLine('1. Just Timer [202X] - Chrome Extension');
      appendLine('2. Retro OS Portfolio [2026] - 80s OS Style');
      appendLine('Try checking out the "Projects.exe" window for details!');
    } 
    else if (cmd === 'blog') {
      if (args.length === 1) {
        appendLine('--- Recent Blog Posts ---');
        blogPostsMetadata.forEach(post => {
          appendLine(`[${post.id}] ${post.title} (${post.date})`);
        });
        appendLine('Type "blog [ID]" to read a specific post (e.g., blog 1)');
      } else {
        const targetId = args[1];
        const post = blogPostsMetadata.find(p => p.id === targetId);
        if (post) {
          appendLine('Connecting to file server...');
          fetch(`/posts/${post.fileName}`)
            .then(res => {
              if (!res.ok) throw new Error();
              return res.text();
            })
            .then(text => {
              appendLine(`=== ${post.title} ===`);
              appendLine(`Date: ${post.date} | Author: ${post.author}`);
              appendLine('--------------------------------------------');
              
              const cleanMd = text.replace(/^---[\s\S]*?---/, '').trim();
              const plainText = cleanMd
                .replace(/#+\s+(.*)/g, '\n=== $1 ===\n')
                .replace(/-\s+/g, '• ')
                .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
                .trim();
              
              plainText.split('\n').forEach(line => {
                appendLine(line);
              });
            })
            .catch(() => {
              appendLine(`Error: Failed to fetch post content.`, 'error');
            });
        } else {
          appendLine(`Error: Post ID "${targetId}" not found.`, 'error');
        }
      }
    } 
    else if (cmd === 'contact') {
      appendLine('To send a message, please use:');
      appendLine('  mail [Your Message Here]');
      appendLine('Example: mail Hello, I love this 80s OS style!', 'muted');
    } 
    else if (cmd === 'clear') {
      setHistory([]);
    } 
    else if (cmd === 'mail') {
      const message = originalQuery.substring(5).trim();
      if (message.length === 0) {
        appendLine('Error: Mail message is empty.', 'error');
      } else {
        appendLine('Connecting to server...');
        setTimeout(() => {
          appendLine('Sending payload packet...');
          setTimeout(() => {
            appendLine('SUCCESS: Mail sent! Thank you for your feedback.', 'accent');
          }, 500);
        }, 500);
      }
    } 
    else {
      appendLine(`Command not found: "${cmd}". Type 'help' for command list.`);
    }
  };

  return (
    <div className="terminal-body">
      <div className="terminal-output system-mono">
        {history.map((line, index) => {
          let className = 'terminal-line';
          if (line.type === 'muted') className += ' text-muted';
          if (line.type === 'accent') className += ' accent-text';
          if (line.type === 'error') className += ' text-error';
          
          return (
            <div key={index} className={className}>
              {line.text.startsWith('> ') ? (
                <span>
                  <span className="terminal-prompt">&gt;</span>{' '}
                  {line.text.substring(2)}
                </span>
              ) : (
                line.text
              )}
            </div>
          );
        })}
        <div ref={outputEndRef} />
      </div>
      <form className="terminal-input-area" onSubmit={handleSubmit} autoComplete="off">
        <span className="terminal-prompt system-mono">&gt;</span>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="terminal-input system-mono"
          placeholder="Type here..."
          autoFocus
        />
      </form>
    </div>
  );
}
