import tkinter as tk
from tkinter import scrolledtext
import threading
import ollama

# --- COLORS (Dark Theme) ---
BG_DARK = "#1e1e2e"       # Background
BG_LIGHTER = "#2a2a3d"    # Input area
TEXT_COLOR = "#cdd6f4"    # Main text
USER_COLOR = "#89b4fa"    # Blue for user
AI_COLOR = "#a6e3a1"      # Green for AI
ACCENT = "#cba6f7"        # Purple accent

class OllamaChatApp:
    def __init__(self, root):
        self.root = root
        self.root.title("💬 Ollama Chat")
        self.root.geometry("700x550")
        self.root.configure(bg=BG_DARK)
        
        # --- HEADER ---
        header = tk.Label(
            root, 
            text="🦙 Ollama Local Chat", 
            font=("Helvetica", 16, "bold"),
            bg=BG_DARK, 
            fg=ACCENT,
            pady=10
        )
        header.pack(fill=tk.X)

        # --- CHAT AREA ---
        self.chat_area = scrolledtext.ScrolledText(
            root, 
            wrap=tk.WORD, 
            state='disabled',
            font=("Menlo", 12),  # Monospace looks cleaner
            bg=BG_LIGHTER,
            fg=TEXT_COLOR,
            insertbackground=TEXT_COLOR,
            relief=tk.FLAT,
            padx=15,
            pady=15
        )
        self.chat_area.pack(padx=15, pady=(0, 10), fill=tk.BOTH, expand=True)
        
        # Tag colors
        self.chat_area.tag_config('user', foreground=USER_COLOR, font=("Menlo", 12, "bold"))
        self.chat_area.tag_config('ai', foreground=AI_COLOR)
        self.chat_area.tag_config('status', foreground="#6c7086", font=("Menlo", 10, "italic"))

        # --- INPUT FRAME ---
        input_frame = tk.Frame(root, bg=BG_DARK)
        input_frame.pack(padx=15, pady=(0, 15), fill=tk.X)

        # Entry box
        self.entry_box = tk.Entry(
            input_frame, 
            font=("Helvetica", 13),
            bg=BG_LIGHTER,
            fg=TEXT_COLOR,
            insertbackground=TEXT_COLOR,
            relief=tk.FLAT,
            highlightthickness=2,
            highlightbackground="#45475a",
            highlightcolor=ACCENT
        )
        self.entry_box.pack(side=tk.LEFT, fill=tk.X, expand=True, ipady=10, padx=(0, 10))
        self.entry_box.bind("<Return>", self.send_message)

        # Send button
        self.send_btn = tk.Button(
            input_frame, 
            text="Send ➤",
            font=("Helvetica", 12, "bold"),
            bg=ACCENT,
            fg=BG_DARK,
            activebackground="#b4befe",
            activeforeground=BG_DARK,
            relief=tk.FLAT,
            padx=20,
            pady=8,
            cursor="hand2",
            command=self.send_message
        )
        self.send_btn.pack(side=tk.RIGHT)

    def send_message(self, event=None):
        user_text = self.entry_box.get().strip()
        if not user_text:
            return

        self.entry_box.delete(0, tk.END)
        self.update_chat(f"You: {user_text}\n", "user")
        
        # Show "thinking" status & disable input
        self.update_chat("AI is thinking...\n", "status")
        self.set_input_state(False)
        
        threading.Thread(target=self.worker_ollama_call, args=(user_text,)).start()

    def worker_ollama_call(self, prompt):
        try:
            response = ollama.chat(model='llama3.2', messages=[
                {'role': 'user', 'content': prompt},
            ])
            ai_response = response['message']['content']
            
            # Remove "thinking" message and show response
            self.root.after(0, self.remove_last_line)
            self.root.after(0, self.update_chat, f"AI: {ai_response}\n\n", "ai")

        except Exception as e:
            self.root.after(0, self.remove_last_line)
            self.root.after(0, self.update_chat, f"❌ Error: {e}\n\n", "ai")
        
        finally:
            self.root.after(0, self.set_input_state, True)

    def update_chat(self, text, tag):
        self.chat_area.config(state='normal')
        self.chat_area.insert(tk.END, text, tag)
        self.chat_area.config(state='disabled')
        self.chat_area.see(tk.END)

    def remove_last_line(self):
        """Remove the 'thinking' message"""
        self.chat_area.config(state='normal')
        self.chat_area.delete("end-2l", "end-1l")
        self.chat_area.config(state='disabled')

    def set_input_state(self, enabled):
        """Enable/disable input while AI is thinking"""
        state = 'normal' if enabled else 'disabled'
        self.entry_box.config(state=state)
        self.send_btn.config(state=state)

if __name__ == "__main__":
    root = tk.Tk()
    app = OllamaChatApp(root)
    root.mainloop()