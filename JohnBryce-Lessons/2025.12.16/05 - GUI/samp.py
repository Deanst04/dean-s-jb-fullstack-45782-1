from kivy.app import App
from kivy.uix.gridlayout import GridLayout
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.button import Button
from kivy.uix.label import Label


class TicTacToe(App):

    def build(self):
        self.current_player = "X"
        self.buttons = []

        main_layout = BoxLayout(orientation="vertical", padding=10, spacing=10)

        self.status = Label(text="Player X's turn", font_size=24)
        main_layout.add_widget(self.status)

        grid = GridLayout(cols=3, spacing=5)

        for i in range(9):
            btn = Button(font_size=40)
            btn.bind(on_press=self.on_button_press)
            self.buttons.append(btn)
            grid.add_widget(btn)

        main_layout.add_widget(grid)

        reset_btn = Button(text="Reset Game", size_hint=(1, 0.2))
        reset_btn.bind(on_press=self.reset_game)
        main_layout.add_widget(reset_btn)

        return main_layout

    def on_button_press(self, button):
        if button.text != "":
            return

        button.text = self.current_player

        if self.check_winner():
            self.status.text = f"🎉 Player {self.current_player} wins!"
            self.disable_buttons()
            return

        if all(btn.text != "" for btn in self.buttons):
            self.status.text = "🤝 It's a draw!"
            return

        self.current_player = "O" if self.current_player == "X" else "X"
        self.status.text = f"Player {self.current_player}'s turn"

    def check_winner(self):
        wins = [
            (0, 1, 2), (3, 4, 5), (6, 7, 8),  # rows
            (0, 3, 6), (1, 4, 7), (2, 5, 8),  # cols
            (0, 4, 8), (2, 4, 6)              # diagonals
        ]

        for a, b, c in wins:
            if (
                self.buttons[a].text ==
                self.buttons[b].text ==
                self.buttons[c].text != ""
            ):
                return True
        return False

    def disable_buttons(self):
        for btn in self.buttons:
            btn.disabled = True

    def reset_game(self, instance):
        self.current_player = "X"
        self.status.text = "Player X's turn"
        for btn in self.buttons:
            btn.text = ""
            btn.disabled = False


TicTacToe().run()
