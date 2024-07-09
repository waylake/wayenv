# wayenv

wayenv는 환경 변수를 관리하기 위한 간단한 CLI 도구입니다. 프로젝트 별로 환경 변수를 쉽게 추가, 삭제, 조회, 백업 등의 기능이 있습니다. 

## 설치

### Homebrew를 통해 설치

```sh
brew tap waylake/wayenv
brew install wayenv
```

### bun 설치 
`wayenv`를 설치하려면 먼저 `bun`을 설치해야 합니다. `bun`은 JavaScript 및 TypeScript 런타임으로, [bun의 공식 GitHub 페이지](https://github.com/oven-sh/bun) 에서 자세한 내용을 확인할 수 있습니다.

```sh
curl -fsSL https://bun.sh/install | bash
```

### 프로젝트 설치 및 실행 

1. GitHub에서 프로젝트를 클론합니다:


```sh
git clone https://github.com/waylake/wayenv.git
cd wayenv
```

```sh
bun install
```

2. 프로젝트를 빌드합니다:


```sh
bun build src/index.ts --compile --outfile wayenv
```

3. 프로젝트를 실행합니다:


```sh
./wayenv --help

Usage: wayenv [options] [command]

CLI for managing environment variables

Options:
  -V, --version             output the version number
  -h, --help                display help for command

Commands:
  init                      Initialize the configuration
  add [options]             Add a new environment variable
  remove [options]          Remove an environment variable
  list [options]            List environment variables
  get [options]             Get the value of an environment variable
  list-projects             List all projects
  rename-project [options]  Rename a project
  update [options]          Update an environment variable value
  search [options]          Search for environment variables by key
  backup [options]          Backup environment variables to a file
  restore [options]         Restore environment variables from a file
  help [command]            display help for command

```

## 사용법 

### 초기화 


```sh
wayenv init
```

### Add

```sh
wayenv add --key <key> --value <value> --project <project>
```
or

```sh
wayenv add
✔ Enter the environment variable key: … test
✔ Enter the environment variable value: … test-value
✔ Enter the project name (default if empty): … default

Added test to the default project.
```

### Remove

```sh
wayenv remove --key <key> --project <project>
```
or

```sh
wayenv remove
✔ Enter the environment variable key: … test
✔ Enter the project name (default if empty): … default
Removed test from the default project.
```

### Listing

```sh
wayenv get --key <key> --project <project>
```

또는 프롬프트를 통해 입력할 수 있습니다:


```sh
wayenv get
```

### 환경 변수 목록 


```sh
wayenv list --format <format> --project <project>
```
 
- `--format`: 출력 형식 (table 또는 list)
 
- `--project`: 프로젝트 이름 (빈 문자열로 두면 모든 프로젝트 목록)

또는 프롬프트를 통해 입력할 수 있습니다:


```sh
wayenv list
```

#### 출력 예시 

##### table 형식 


```sh
wayenv list --format table
```

```bash
┌──────────────────────────────┬──────────────────────────────────────────────────┬────────────────────┐
│ Key                          │ Value                                            │ Project            │
├──────────────────────────────┼──────────────────────────────────────────────────┼────────────────────┤
│ test                         │ test-value                                       │ test-project       │
└──────────────────────────────┴──────────────────────────────────────────────────┴────────────────────┘
```

##### list 형식 


```sh
wayenv list --format list
```

```sh
Environment Variables:
test (test-project): test-value
```

### 프로젝트 목록 


```sh
wayenv list-projects
```

### 프로젝트 이름 변경 


```sh
wayenv rename-project --old-name <oldName> --new-name <newName>
```

```sh
wayenv rename-project
```

## Contribute 

버그 리포트, 기능 제안 또는 Pull Request를 통해 기여할 수 있습니다.

1. 리포지토리를 포크합니다.
 
2. 새로운 브랜치를 생성합니다 (`git checkout -b feature/your-feature`).
 
3. 변경 사항을 커밋합니다 (`git commit -am 'Add some feature'`).
 
4. 브랜치에 푸시합니다 (`git push origin feature/your-feature`).

5. Pull Request를 생성합니다.
