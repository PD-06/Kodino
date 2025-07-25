import React, { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { apiService } from '../services/api';
import './EditorPage.css';

const EditorPage: React.FC = () => {
  const [code, setCode] = useState<string>(
    '# Tulis kode Python Anda di sini\ncetak("Halo, Dunia!")\n'
  );
  const [output, setOutput] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'output' | 'feedback'>('output');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value);
    }
  };

  const executeCode = async () => {
    if (!code.trim()) {
      setError('Kode tidak boleh kosong');
      return;
    }

    setIsLoading(true);
    setError(null);
    setOutput('Menjalankan kode...');
    setFeedback('');
    setActiveTab('output');

    try {
      const result = await apiService.executePythonCode(code);
      
      if (result.status === 'success') {
        setOutput(result.output || 'Kode berhasil dijalankan (tidak ada output)');
        if (result.feedback) {
          setFeedback(result.feedback);
        }
      } else {
        setOutput(`Error: ${result.output || 'Terjadi kesalahan saat menjalankan kode'}`);
        setFeedback(result.feedback || 'Tidak ada feedback tambahan');
      }
    } catch (err) {
      console.error('Error executing code:', err);
      setOutput('Error: ' + (err instanceof Error ? err.message : String(err)));
      setFeedback('Gagal mendapatkan feedback dari server');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output, feedback]);

  // Format error messages with line numbers
  const formatErrorOutput = (errorMsg: string) => {
    if (!errorMsg) return errorMsg;
    
    // Add line numbers to Python traceback
    return errorMsg
      .split('\n')
      .map((line, i) => {
        if (line.includes('File "<string>", line')) {
          return `<div class="error-line">${line}</div>`;
        }
        return line;
      })
      .join('\n');
  };

  return (
    <div className="editor-container">
      <div className="editor-header">
        <h1>
          <img src="/images/kodino-mascot.webp" alt="Kodino Mascot" className="mascot" />
          Python Editor
        </h1>
        <button
          className="run-button"
          onClick={executeCode}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="spinner"></span>
              Menjalankan...
            </>
          ) : (
            '▶️ Jalankan Kode'
          )}
        </button>
      </div>

      <div className="editor-wrapper">
        <Editor
          height="60vh"
          defaultLanguage="python"
          value={code}
          onChange={handleEditorChange}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            wordWrap: 'on',
            automaticLayout: true,
            scrollBeyondLastLine: false,
            padding: { top: 16 },
            lineNumbers: 'on',
            renderWhitespace: 'selection',
            renderLineHighlight: 'all',
            scrollbar: {
              vertical: 'auto',
              horizontal: 'auto',
            },
          }}
        />
      </div>

      <div className="output-container">
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'output' ? 'active' : ''}`}
            onClick={() => setActiveTab('output')}
          >
            Output
          </button>
          <button
            className={`tab ${activeTab === 'feedback' ? 'active' : ''}`}
            onClick={() => setActiveTab('feedback')}
            disabled={!feedback}
          >
            AI Feedback {feedback && '💡'}
          </button>
        </div>
        
        <div 
          className={`output-content ${activeTab === 'output' ? '' : 'hidden'}`} 
          ref={outputRef}
        >
          {error ? (
            <div className="error-message">{error}</div>
          ) : output.startsWith('Error:') ? (
            <div 
              className="error"
              dangerouslySetInnerHTML={{ 
                __html: formatErrorOutput(output) 
              }} 
            />
          ) : (
            <pre className={output.includes('berhasil') ? 'success' : ''}>
              {output}
            </pre>
          )}
        </div>
        
        <div 
          className={`feedback-content ${activeTab === 'feedback' ? '' : 'hidden'}`}
          ref={activeTab === 'feedback' ? outputRef : null}
        >
          {feedback ? (
            <div 
              className="feedback-text"
              dangerouslySetInnerHTML={{ 
                __html: feedback
                  .replace(/\n/g, '<br />')
                  // .replace(/```python\n([^\`]*?)\n```/g,
                  //   '<pre><code class="language-python">$1</code></pre>')
                  // .replace(/`([^`]+)`/g, '<code>$1</code>')
              }} 
            />
          ) : (
            <div className="no-feedback">
              <p>Jalankan kode Anda untuk mendapatkan feedback dari AI.</p>
              <p>AI akan membantu Anda memahami kesalahan dan memberikan saran perbaikan.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditorPage;
