
<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
=======
# cleancode-week-2


## Description

- `특강 신청 서비스`를 구현해 봅니다.
- 항해 플러스 토요일 특강을 신청할 수 있는 서비스를 개발합니다.
- 특강 신청 및 신청자 목록 관리를 RDBMS를 이용해 관리할 방법을 고민합니다.

## Requirements

- 아래 2가지 API 를 구현합니다.
    - 특강 신청 API
    - 특강 신청 여부 조회 API
- 각 기능 및 제약 사항에 대해 단위 테스트를 반드시 하나 이상 작성하도록 합니다.
- 다수의 인스턴스로 어플리케이션이 동작하더라도 기능에 문제가 없도록 작성하도록 합니다.
- 동시성 이슈를 고려하여 구현합니다.

## API Specs

1️⃣ **(핵심)** 특강 신청 **API**

- 특정 userId 로 선착순으로 제공되는 특강을 신청하는 API 를 작성합니다.
- 동일한 신청자는 한 번의 수강 신청만 성공할 수 있습니다.
- 특강은 `4월 20일 토요일 1시` 에 열리며, 선착순 30명만 신청 가능합니다.
- 이미 신청자가 30명이 초과되면 이후 신청자는 요청을 실패합니다.

**2️⃣ (기본)** 특강 신청 완료 여부 조회 API

- 특정 userId 로 특강 신청 완료 여부를 조회하는 API 를 작성합니다.
- 특강 신청에 성공한 사용자는 성공했음을, 특강 등록자 명단에 없는 사용자는 실패했음을 반환합니다.

3️⃣ **(선택) 특강 선택 API**

- 단 한번의 특강을 위한 것이 아닌 날짜별로 특강이 존재할 수 있는 범용적인 서비스로 변화시켜 봅니다.
- 이를 수용하기 위해, 특강 엔티티의 경우 기존의 설계에서 변경되어야 합니다.
- 특강의 정원은 30명으로 고정이며, 사용자는 각 특강에 신청하기전 목록을 조회해볼 수 있어야 합니다.


## ERD
![drawSQL-image-export-2024-03-25 (2)](https://github.com/dlwlsh92/cleancode-week-2/assets/102504924/f16bd25c-fab6-4f36-a4c1-84848d43cf32)



## API spec 별 설계 내용

1️⃣ **(핵심)** 특강 신청 **API**

1. 특정 userId로 선착순으로 제공되는 특강을 신청하는 API를 작성한다.
    1. 선착순을 생각하면 queue를 사용해야 하나 싶지만 애초에 선착순이라는 의미가 모호한 것 같음. 이를 위해 queue를 사용한다 하더라도 네트워크에 의해 더 늦게 오는 경우가 있을텐데 의미가 없다.
    2. 따라서, queue를 사용하지 않고, lock을 사용하여 구현하는게 더 합리적이라 판단함. 또한, 해당 비즈니스 케이스는 신청 결과를 바로 반환해주는 것이 유저와의 상호작용 측면에서 더 부합한다고 판단함.
    3. queue는 즉각적으로 반환하지 않아도 되고, 지연되더라도 해당 태스크가 성공적으로 성공하기만 하면 되는 케이스에 더 적합하다고 판단함(email 대량 전송과 같은)
2. 동일한 신청자는 한 번의 수강 신청만 할 수 있다.
    1. 신청 시 enrollments에서 courseId와 roundId, userId로 조회하여 수강 등록 이력이 있는지 확인하는 로직을 추가한다.
3. 특강은 4월 20일 토요일 1시에 열리며, 선착순 30명만 신청 가능하다
    1. rounds에 등록 시작을 나타내는 enrollmentStartDate를 통해 service에서 신청한 강의의 기수 등록 일자와 현재 시각을 비교하여 등록 가능 여부를 확인한다.
    2. rounds의 해당 기수의 최대 정원을 나타내는 maxEnrolledCapacity를 기수 별로 저장하여 최대 인원을 확인할 수 있도록 하고, 현재 등록한 인원 수를 나타내는 enrolledCount를 확인하여 최대 인원을 초과하지 않는 경우에만 enrollment를 생성할 수 있도록 한다. 그리고, enrolledCount의 숫자를 1 증가시킨다
    3. 따라서, enrolledCount를 read하고 업데이트 하는 과정을 lock으로 동시성 제어를 해야 할 필요가 있어 보인다.
4. 이미 신청자가 30명이 초과되면 이후 신청자는 요청을 실패합니다.
    1. service에서 해당 강연 및 기수 정보를 조회하여 enrolledCount가 maxEnrolledCapacity를 초과했을 경우 에러를 반환한다.

**2️⃣ (기본)** 특강 신청 완료 여부 조회 API

1. 특정 userId로 특강 신청 완료 여부를 조회하는 API를 작성한다.
    1. courseId, roundId, userId를 통해 enrollment의 isRegistered가 true인 table이 존재하는지 확인하고, 있을 경우 true를 없을 경우 false를 반환한다.

3️⃣ **(선택) 특강 선택 API**

1. 단 한번의 특강을 위한 것이 아닌 날짜별로 특강이 존재할 수 있는 범용적인 서비스로 변화시킨다.
    1. 강의 별 기수를 만들어 날짜별로 특강을 따로 신청할 수 있도록 한다.
2. 특강의 정원은 30명으로 고정이며, 사용자는 각 특강에 신청하기전 목록을 조회해볼 수 있어야 한다.
    1. courseId로 전체 round를 조회해서 각 round의 특강 신청 날짜, 특강 날짜, 최대 정원, 현재 등록 인원을 같이 조회할 수 있도록 작성한다.




