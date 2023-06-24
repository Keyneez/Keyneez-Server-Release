EXIST_BLUE=$(docker compose -p keyneez-blue -f ./docker-compose/docker-compose.blue.yml ps | grep Up)

if [ -z "$EXIST_BLUE" ]; then
	docker compose -p keyneez-blue -f ./docker-compose/docker-compose.blue.yml pull &&
	docker compose -p keyneez-blue -f ./docker-compose/docker-compose.blue.yml up -d
	BEFORE_COLOR="green"
	AFTER_COLOR="blue"
	BEFORE_PORT="4001"
	AFTER_PORT="4000"
	echo "현재 green container 실행 중.. blue 컨테이너 실행 시작 "
else
	docker compose -p keyneez-green -f ./docker-compose/docker-compose.green.yml pull &&
	docker compose -p keyneez-green -f ./docker-compose/docker-compose.green.yml up -d
	BEFORE_COLOR="blue"
	AFTER_COLOR="green"
	BEFORE_PORT="4000"
	AFTER_PORT="4001"
	echo "현재 blue 컨테이너 실행 중 ... green 컨테이너 실행 시작"
fi

echo "${AFTER_COLOR} 컨테이너 구동 준비 완료, server port = ${AFTER_PORT}"

for cnt in 1 2 3 4 5 6 7 8 9 10
do
	echo "서버 응답 확인중 .. (${cnt}/10)"
	UP=$(curl -s http://localhost:${AFTER_PORT}/api/health |grep 'ok')
	echo $UP
	if [ -z "${UP}" ]; then
		sleep 5
		continue
	else
		break
	fi
done

echo "count : $cnt"
if [ $cnt -eq 10 ];
then
	echo "${AFTER_COLOR} 서버가 정상적으로 구동 되지 않았습니다"
	exit 1
fi

sudo sed -i "s/${BEFORE_PORT}/${AFTER_PORT}/" /etc/nginx/conf.d/service-url.inc
sudo nginx -s reload
echo "DEPLOY END!! new Container ${AFTER_COLOR} 서버 러닝 시작"

echo "기존 ${BEFORE_COLOR} 컨테이너 종료 "
docker compose -p keyneez-${BEFORE_COLOR} -f ./docker-compose/docker-compose.${BEFORE_COLOR}.yml down
echo "image clean Up"
docker rmi -f $(docker images -f "dangling=true" -q) || true