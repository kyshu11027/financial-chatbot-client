import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { Message } from "@/types/conversations";
import { convertLatexDelimiters } from "@/lib/utils";
import { Options } from "remark-math";
import "katex/dist/katex.min.css";

const remarkMathOptions: Options = {
  singleDollarTextMath: false,
};

export default function AIOutput({ message }: { message: Message }) {
  return (
    <div className="markdown-text prose prose-sm flex flex-col gap-5 leading-snug whitespace-pre-wrap">
      <ReactMarkdown
        components={{
          li: ({ node, children, ...props }) => (
            <li {...props}>
              <span> {children}</span>
            </li>
          ),
        }}
        remarkPlugins={[[remarkMath, remarkMathOptions]]}
        rehypePlugins={[rehypeKatex]}
      >
        {convertLatexDelimiters(message.message)}
      </ReactMarkdown>
    </div>
  );
}
