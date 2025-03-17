import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/atom-one-dark.css'

const MarkDownRenderer = ({ content }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeHighlight]}
      components={{
        h1: ({ node, ...props }) => <h1 className="blog-h1" {...props} />,
        h2: ({ node, ...props }) => <h2 className="blog-h2" {...props} />,
        ul: ({ node, ...props }) => <ul className="blog-list" {...props} />,
        code: ({ node, inline, className, children, ...props }) => {
          const match = /language-(\w+)/.exec(className || '')
          return !inline && match ? (
            <pre className="code-block">
              <code className={className} {...props}>
                {children}
              </code>
            </pre>
          ) : (
            <code className="inline-code" {...props}>
              {children}
            </code>
          )
        }
      }}
    >
      {content}
    </ReactMarkdown>
  )
}

export default MarkDownRenderer