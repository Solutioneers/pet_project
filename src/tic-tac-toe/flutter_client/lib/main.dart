import 'package:flutter/material.dart';

void main() {
  runApp(const TicTacToeApp());
}

class TicTacToeApp extends StatelessWidget {
  const TicTacToeApp({super.key});

  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      home: _TicTacToeScreen(),
    );
  }
}

class _TicTacToeScreen extends StatefulWidget {
  const _TicTacToeScreen();

  @override
  _TicTacToeScreenState createState() => _TicTacToeScreenState();
}

class _TicTacToeScreenState extends State<_TicTacToeScreen> {
  List<List<String>> board = List.generate(3, (_) => List.filled(3, ''));

  bool isPlayerX = true; // true if it's player X's turn, false for player O

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Tic-Tac-Toe'),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            for (int i = 0; i < 3; i++)
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  for (int j = 0; j < 3; j++)
                    SizedBox(
                      width: 70,
                      height: 70,
                      child: ElevatedButton(
                        onPressed: () {
                          if (board[i][j] == '') {
                            setState(() {
                              board[i][j] = isPlayerX ? 'X' : 'O';
                              isPlayerX = !isPlayerX;
                            });
                          }
                        },
                        child: Text(board[i][j]),
                      ),
                    ),
                ],
              ),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: () {
                // Reset the game
                setState(() {
                  board = List.generate(3, (_) => List.filled(3, ''));
                  isPlayerX = true;
                });
              },
              child: const Text('Reset Game'),
            ),
          ],
        ),
      ),
    );
  }
}
