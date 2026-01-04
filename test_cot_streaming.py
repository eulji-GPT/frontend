import requests
import json

try:
    print("CoT 스트리밍 테스트 시작...")
    response = requests.post('http://localhost:8000/cot', 
                           json={'question': '안녕하세요'}, 
                           stream=True)
    print(f'상태 코드: {response.status_code}')
    
    if response.status_code == 200:
        print('스트리밍 응답 수신 중...')
        line_count = 0
        for line in response.iter_lines(decode_unicode=True):
            if line and line.startswith('data: '):
                line_count += 1
                try:
                    data = json.loads(line[6:])
                    msg_type = data.get("type", "unknown")
                    print(f'  {line_count}. {msg_type}')
                    
                    if msg_type == "final_answer_chunk":
                        chunk = data.get("final_answer_chunk", "")
                        print(f'     청크: "{chunk[:30]}..."')
                        
                except Exception as parse_error:
                    print(f'  {line_count}. 파싱 오류')
                    
            if line_count > 15:
                print("  ... (출력 제한)")
                break
    else:
        print(f'에러: 상태코드 {response.status_code}')
        
except Exception as e:
    print(f'연결 실패: {e}')
