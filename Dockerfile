FROM nginx:alpine

# 기본 nginx 페이지 제거
RUN rm -rf /usr/share/nginx/html/*


COPY dist/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/nginx.conf
