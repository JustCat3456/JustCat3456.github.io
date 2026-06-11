import React, { useState, useEffect } from 'react';
import { marked } from 'marked';

// 記事のメタデータ一覧
export const blogPostsMetadata = [
  {
    id: "1",
    title: "RQuickShareを使って簡単にファイル共有",
    date: "2024-12-20",
    author: "Haruki Saito",
    fileName: "rquick.md"
  },
  {
    id: "2",
    title: "Linuxディストリビューションについての話",
    date: "2024-12-19",
    author: "haruki saito",
    fileName: "aboutlinux.md"
  },
  {
    id: "3",
    title: "Homepageの更新をしました",
    date: "2024-12-18",
    author: "haruki saito",
    fileName: "firstpost.md"
  }
];

export default function Blog() {
  const [selectedPost, setSelectedPost] = useState(blogPostsMetadata[0]);
  const [postContentHtml, setPostContentHtml] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedPost) return;

    setLoading(true);
    fetch(`/posts/${selectedPost.fileName}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to load markdown file.');
        return res.text();
      })
      .then(text => {
        // Frontmatter (--- ... ---) の除去
        const cleanMarkdown = text.replace(/^---[\s\S]*?---/, '').trim();
        const html = marked.parse(cleanMarkdown);
        setPostContentHtml(html);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setPostContentHtml(`<p class="error-text">ERROR: 記事の読み込みに失敗しました。</p>`);
        setLoading(false);
      });
  }, [selectedPost]);

  return (
    <div className="blog-layout">
      {/* 左ペイン: 記事リスト */}
      <aside className="blog-sidebar system-mono">
        {blogPostsMetadata.map((post) => (
          <div
            key={post.id}
            className={`blog-item ${selectedPost.id === post.id ? 'active-post' : ''}`}
            onClick={() => setSelectedPost(post)}
          >
            <div className="blog-item-title">{post.title}</div>
            <div className="blog-item-date">{post.date}</div>
          </div>
        ))}
      </aside>

      {/* 右ペイン: 記事本文リーダー */}
      <section className="blog-content-pane">
        {loading ? (
          <div className="system-mono">LOADING ARTICLE...</div>
        ) : (
          <>
            <h1 className="blog-content-title">{selectedPost.title}</h1>
            <div className="blog-content-meta">
              Date: {selectedPost.date} | Author: {selectedPost.author}
            </div>
            <div
              className="blog-content-body"
              dangerouslySetInnerHTML={{ __html: postContentHtml }}
            />
          </>
        )}
      </section>
    </div>
  );
}
