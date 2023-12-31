# hangman

<img width="948" alt="image" src="" />

게임 진행 시 잘못된 문자를 작성한 경우 행맨 그림을 SVG를 이용해 그리며 모든 그림이 완성될 때까지 사용자는 제시어를 맞춰야 합니다.

## How to Play

행맨 게임은 단어를 추측하는 게임으로, 게임에서 생성된 랜덤 제시어를 사용자가 맞추는 게임입니다. 제시어를 맞추는 과정에서 지정된 시도 횟수 내에 정답을 맞추는 것이 목표입니다.

게임 룰은 다음과 같습니다:

1. 게임 시작: 먼저 게임의 제시어를 랜덤하게 생성합니다. 사용자는 해당 제시어를 맞추게 됩니다.
2. 게임 상태 표시: 맞추어야 할 단어의 길이만큼 밑줄이 표시되며, 몇 개의 문자로 이루어져 있는지 알려줍니다.
3. 문자 추측: 맞추어야 할 단어의 길이만큼의 밑줄이 표시되는 상태에서 추측한 문자를 입력합니다.
4. 정답 검사: 입력한 문자가 단어에 포함되어 있는지 확인합니다. 맞는 경우 해당 위치에 문자가 들어가고, 틀린 경우 틀렸다는 것을 표시합니다.
5. 오답 기록: 틀린 문자를 추측한 경우, 그 문자는 오답 기록에 추가되며 몇 번의 기회를 남겼는지 표시됩니다. 틀린 횟수가 지정된 횟수를 넘어가면 게임이 종료됩니다.
6. 게임 종료: 플레이어가 정답을 맞추거나 틀린 횟수가 지정된 횟수를 넘어가면 게임이 종료됩니다. 정답을 맞추면 승리하게 되고, 틀린 횟수를 초과하면 패배합니다.

## Features

-   [x] svg를 이용해 hangman 그림 표시
-   [ ] 랜덤 단어 생성
-   [ ] 올바른 문자 표시
-   [ ] 잘못된 문자 표시
-   [ ] 중복 입력된 문자 팝업 표시
-   [ ] 결과 Notification

## Play

https://hyewonkkang.github.io/mini-game-hub/hangman/
