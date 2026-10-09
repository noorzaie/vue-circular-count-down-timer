import hljs from 'highlight.js/lib/core';
import bash from 'highlight.js/lib/languages/bash';
import css from 'highlight.js/lib/languages/css';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';

hljs.registerLanguage('bash', bash);
hljs.registerLanguage('css', css);
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('xml', xml);

export type CodeLanguage = 'bash' | 'css' | 'javascript' | 'typescript' | 'vue';

export function highlight (code: string, language: CodeLanguage): string {
	// Vue SFCs are HTML with <script> and <style> blocks, which the xml grammar handles
	return hljs.highlight(code, { language: language === 'vue' ? 'xml' : language }).value;
}
