import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import { Message } from "@/types/conversations";
import { convertLatexDelimiters } from "@/lib/utils";
import { Options } from "remark-math";
import "katex/dist/katex.min.css";

const remarkMathOptions: Options = {
  singleDollarTextMath: false,
};

export default function AIOutput({ message }: { message: Message }) {
  return (
    <div className="markdown-text prose prose-sm flex flex-col gap-5 leading-snug ">
      <ReactMarkdown
        remarkPlugins={[[remarkMath, remarkMathOptions], remarkGfm]}
        rehypePlugins={[rehypeKatex]}
      >
        {convertLatexDelimiters(message.message)}
      </ReactMarkdown>
    </div>
  );
}
