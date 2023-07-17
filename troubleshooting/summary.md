## 마일스톤 1
상태: aws ecr get-login-password --region ap-northeast-2 
| docker login --username AWS --password-stdin 257840391579.dkr.ecr.ap-northeast-2.amazonaws.com 명령어가 <br>broken pipe 뜨면서 연결이 안됨<br>
원인: 인증정보가 파이프로 넘어가지 않는 것이 원인으로 파악됨<br>
해결: (aws ecr get-login --no-include-email --region ap-northeast-2) 로 인증상태값을 주는 docker login 값을 받음

## 마일스톤 2
상태: docker-compose up을 하는데 client쪽에서 에러가 계속 발생<br>
원인: docker-compose.yml 에서 build를 사용해서 발생하는 문제라고 파악됨(빌드에서 오류가 발생함)<br>
해결: dockerfile로 이미지를 빌드해서, docker-compose에서 빌드된 이미지를 활용하도록 변경하니까 해결

## 마일스톤 3
상태: 처음 만든 github action에서 docker/compose-cli-action@v0.6.0라는 없는 액션을 참조했음<br>
해결: 해당 액션을 제거하고, github action을 새로 구성

상태:이미지를 빌드하려는데 빌드 오류 발생<br>
원인: 이미지를 빌드하려고 하는 디렉토리가 틀림(/에서 빌드하려고해서 에러, /helloworld-was로 이동되어야 함)<br>
해결: action에 명령어 cd helloworld-was를 추가하니 정상 작동

## 마일스톤 4
상태: mongodb 서비스가 타겟그룹에서 unhealthy가 뜨면서, 태스크가 무한 생성됨 <br>
원인: 도달해야하는 포트의 인바운드 규칙이 보안그룹에서 설정이 안되있음<br>
해결: 보안그룹에서 mongodb의 포트 27017에 대한 인바운드 규칙을 추가하니 작동됨

상태: mongodb에 사용자 아이디와 비밀번호 설정이 제대로 되지 않음<br>
원인: 해당 내용의 환경변수들이 제대로 전달이 안되서 생기는 오류<br>
해결: 환경변수 설정 등을 수정하여 트러블슈팅

상태: mongodb 자체를 가져왔을 땐 되다가, 암호를 추가하니깐 mongodb compass에서 접속이 안됨<br>
원인: url로 넘겨줄때에 뒤에 ?authMechanism=DEFAULT 가 누락됨<br>
수정: 해당 내용을 url에 추가하니 작동됨

## 마일스톤 5
상태: was 서비스를 배포하는데 컨테이너가 제대로 동작을 안함<br>
원인: 확인결과 was 코드에 문제가 있었다. was 서비스가 db 접속이 되야 정상작동하는데, 접속이 안됨<br>
(url이 localhost이거나 docker-compose 경우로 적용되어있어서 안됬음)

상태: 환경변수(aws secret에서 가져온 값)이 전달이 안됨 <br>
원인: ecs 역할에 secret manager을 읽는 권한이 없음<br>
해결: IAM에서 ECS 역할에 secret manager를 읽을 수 있는 권한을 부여해야함

상태: secret manager에서 환경변수는 설정됬는데, url에 전달이 안됨 <br>
원인: 
1. ecs에서 환경변수를 넣을때, secret manager arn 통째로 넣으니까 관련 내용이 객체로 전부 전달됨
2. 뒤에 :: 등을 붙여서 특정 키의 값만 가져오려고 하는데, 오타 공백 등으로 설정이 잘못됨
3. 환경 변수 값들이 특정 형태에서 제대로 할당이 안됨
const { MONGO_HOSTNAME, MONGO_USERNAME, MONGO_PASSWORD } = process.env
해결: 각 값들을 변수에 일일히 할당해서 url로 넘겨주니 정상적으로 작동

## 마일스톤 6
특별한 에러가 발생하지 않음

팀원 트러블 슈팅<br>
상태: credentials cannot be loaded from any provider<br>
원인: github action에서 사용하는 aws key의 이름과, action secret에서 사용하는 key의 이름이 달라서 오류가 발생<br>
해결: 두 키의 이름을 동일하게 수정하니, 해결


## 마일스톤 7
상태: github action에서 빌드하니까 오류남<br>
원인: 로컬에서는 compiled with warning으로 진행되는데, action 환경에서는 compiled fail이 발생<br>
해당 사항을 고치려 해봐도 로그가 부실해서 어디서 문제나는지 찾을 수 없음<br>
해결: 선회해서 codepipeline 사용 

상태: codepipeline 빌드에서 오류 발생<br>
원인: buildspec.yml에서 잘못된 값을 작성하였다.<br>
해결:
1. 아티팩트 base-directory 잘못 설정, 해당 내용 수정
2. 정상 작동
3. github 레포지토리의 구성을 변경함
4. 빌드 위치가 안맞아서 에러 발생
5. 빌드 위치를 맞추기 위해 cd 명령어 추가, base-directory도 결과물이 나오는 디렉토리로 재수정

상태: 프론트엔드와 was의 레포지토리가 떨어져 있어, 해당 내용을 하나로 통합하고자 하는데 에러발생<br>
원인: 두 개를 git clone으로 받을 시, git 저장소가 2개인 상태라 하나의 레포지토리로 안올라감<br>
해결: 프론트엔드 디렉토리 안의 내용물만 복사해서 was 쪽의 새로운 디렉토리로 복사

## 마일스톤 8 
특별한 에러가 없었음

## 마일스톤 9
상태: mixed content<br>
원인: https 프로토콜을 사용하는 cloudfront 환경에서, http 프로토콜을 사용하는 로드밸런서에 데이터를 요청함<br>
해결: 프런트엔드에서 요청을 보내는 REACT_APP_ENDPOINT이 http로 작성되어 있기에, https로 수정

상태: REACT_APP_ENDPOINT를 변경하고 재배포 했는데, 변경사항이 s3와 cloudfront에 반영이 안됨<br>
원인: pipeline에서 buildspec.yml 에서 REACT_APP_ENDPOINT을 env 값으로 할당하면 첫번째 시도 때의 값에서 변경이 안되는 상태를 파악<br>
해결: 새로운 s3 생성해서 해결

상태: 인증서 유효 오류<br>
원인: 인증서는 *.wngud9646.click 인데, REACT_APP_ENDPOINT에 로드밸런서 dns를 적어놨더니 유효하지 않다고 판단되는 것으로 추측<br>
해결: REACT_APP_ENDPOINT를 wngud9646.click의 별칭으로 로드밸런서에 접근하도록 함

상태: cors 에러<br>
원인: 서로 다른 오리진에 통신을 요청해서 발생하는 CORS 에러<br>
해결: plugins/cors.js가 있지만 해당 파일에 <br> 
  fastify.register(require('@fastify/cors') , {
    origin: '*'
  })<br>
내용을 추가하였다. <br>
s3에서도 cors 정책 추가하였다.<br>
(이쪽이 좀 더 주요한 원인인 것으로 파악된다.)

## 마일스톤 10 
상황: 방금 post한 데이터를 가져오는데 전체 order의 데이터를 가져옴<br>
원인: const result = await orders.find({}).toArray(); 이렇게 쿼리를 전체를 가져오도록 보내기 때문으로 확인<br>
해결: 
```
const neworder = await orders.insertOne(orderData)
const newOrderId = neworder.insertedId;

const query = { _id: newOrderId };<br>
const result = await orders.findOne(query);
``` 

의 형태로 쿼리를 보냄. 

상황: order를 id로 가져오는 쿼리가 제대로 작동하지 않는다.<br>
원인: ObjectId를 사용하는데 이는, mongodb 플러그인을 require로 가져와야한다.<br>
이를 하지 않아서 ObjectId를 사용하면 에러발생<br>
해결:
```
const { ObjectId } = require('mongodb')
...
const query = { _id: new ObjectId(orderId) };
```

objectid를 import해서 사용하니까 작동됨.

상황: 프런트엔드에서 주문을 했더니, /tab/InDelivery.js 13번 줄에서 에러 발생<br>
원인: post reponse 형태를 잘못 맞춰서, 프론트에서 에러 발생(deliveryInfo.status가 없어서 생기는 에러)
해결: post 메소드에서 request 요청을 토대로, 데이터베이스에 입력할 Data를 생성<br>