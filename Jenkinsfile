def createVersion() {
    // 定义一个版本号作为当次构建的版本，输出结果 20191210175842_69
    return new Date().format('YYYY-MM-DD HH:mm:ss')
}

pipeline {
    agent any 
    options{
        buildDiscarder(logRotator(numToKeepStr: '30'))
        timeout(time: 10, unit: 'MINUTES')
        disableConcurrentBuilds()
    }
    environment {
        git="172.17.101.191:2223/RG/RunnerGo-fe.git"
        def BUILDVERSION = createVersion()
        feishuWb="https://open.feishu.cn/open-apis/bot/v2/hook/e1ea72fe-d073-4304-bf9d-21fbb602986e"
        scriptPath="/data/docker/jenkins/fasongfeishu"
    }
//     选择标签选项    ssh://git@172.17.101.191:2223/apipost/apipost-fe-v2.git 
    parameters {
        listGitBranches(
            branchFilter: 'refs/heads/(.*)',
            defaultValue: "",
            name: 'WEBHOOK_REF',
            type: 'PT_BRANCH_TAG',
            remoteURL: 'ssh://git@172.17.101.191:2223/RG/RunnerGo-fe.git',
            credentialsId: 'bcb57094-5e19-4f14-9c15-0046ed8a91fe',
            selectedValue: 'DEFAULT',
            sortMode: 'DESCENDING'
            )

  }
// http://172.17.101.191:8080/generic-webhook-trigger/invoke?token=apipost_fe1234
// 自动触发发布
        triggers {
        // 由 Generic Webhook Trigger 提供的触发器
        GenericTrigger(
                // 参数, 在这里配置的参数会被配置为环境变量
                // 支持使用 JSONPath 和 XPath 进行提取
                // 提取来源为 webhook 发送的 request body 中的内容
                // GitLab 发送的 request body 内容格式可通过文档查看, 文档地址为你的 GitLab 访问地址 + /help/user/project/integrations/webhooks
                genericVariables: [
                        // 提取分支名称, 格式为 refs/heads/{branch}
                        [key: 'WEBHOOK_REF', value: '$.ref'],
                        // 提取用户显示名称
                        [key: 'WEBHOOK_USER_NAME', value: '$.user_name'],
                        // 提取最近提交 id
                        [key: 'WEBHOOK_RECENT_COMMIT_ID', value: '$.commits[-1].id'],
                        // 提取最近提交 message
                        [key: 'WEBHOOK_RECENT_COMMIT_MESSAGE', value: '$.commits[-1].message'],
                        // 如需更多参数可通过查看 request body 参数文档进行提取
                ],

                // 项目运行消息, 会显示在 Jenkins Blue 中的项目活动列表中
                causeString: '$WEBHOOK_USER_NAME 推送 commit 到 $WEBHOOK_REF 分支',

                // token, 因为对外的 webhook url 是一致的, 当希望触发某个特定的 Job 时可以为每个 Job 配置不同的 token, 然后在 webhook 中配置该参数
                token: 'kunpengv123',

                // 打印通过 genericVariables 配置的变量
                printContributedVariables: true,
                // 打印 request body 内容
                printPostContent: true,

                // 避免使用已触发工作的信息作出响应
                silentResponse: false,

                // 可选的正则表达式过滤, 比如希望仅在 master 分支上触发, 你可以进行如下配置
                regexpFilterText: '$WEBHOOK_REF',
                regexpFilterExpression: 'refs/heads/' + env.BRANCH_NAME
        )
    }  
 
    stages {
        stage('清理工作空间'){steps {cleanWs()}}
        stage('代码下载') {
            steps {
                 wrap([$class: 'BuildUser']) {
 
                   script {
                       if ( env.BUILD_USER ) {
                             env.WEBHOOK_USER_NAME="${env.BUILD_USER}"
                       }
                    
                   }
                   print "++ $env.WEBHOOK_USER_NAME"
				}


                checkout([$class: 'GitSCM', 
                          branches: [[name: "${WEBHOOK_REF}"]], 
                          doGenerateSubmoduleConfigurations: false, 
                          extensions: [], 
                          gitTool: 'Default', 
                          submoduleCfg: [], 
                          userRemoteConfigs: [[credentialsId: 'bcb57094-5e19-4f14-9c15-0046ed8a91fe', url: "ssh://git@${git}",]]
                        ])
            }
        }

        stage('npm 编译代码') {
            steps {
            nodejs('node-v16.13.0'){
            sh''' npm config set registry  https://registry.npm.taobao.org
                  npm config get registry
                  node -v 
                  export CI=false
                  npm i 
                  npm  run build:${JOB_BASE_NAME}
            '''
                }
            }
        }
        
    stage('发布到测试环境') {
        when {
               expression {   return JOB_BASE_NAME == "test" }
            }
            steps {
                 ansiblePlaybook( 
                	installation: 'ansible2.9.25', 
                	inventory: "${env.WORKSPACE}/hosts", 
                	limit: '172.17.101.188', 
                	playbook: "${env.WORKSPACE}/playbook.yaml",
                	extraVars: [
                		project_name:'kunpeng-fe',
                		deploy_path:'/data/Application/',
                		WORKSPACE:"${env.WORKSPACE}/build",
                        backfile: 'false'
                	])
            }
    }
    // stage('发布到beta环境') {
    //     when {
    //            expression {   return JOB_BASE_NAME == "v7-beta" }
    //         }
    //         steps {
    //              ansiblePlaybook( 
    //             	installation: 'ansible2.9.25', 
    //             	inventory: "${env.WORKSPACE}/hosts", 
    //             	limit: '172.17.101.188', 
    //             	playbook: "${env.WORKSPACE}/playbook.yaml",
    //             	extraVars: [
    //             		project_name:'Apipost_fev2',
    //             		deploy_path:'/docker/Application/',
    //             		WORKSPACE:"${env.WORKSPACE}/build",
    //                     backfile: 'false'
    //             	])
    //         }
    // }

    // stage('发布到生产环境') {
    //     when {
    //             expression {   return JOB_BASE_NAME == "master" }
    //         }
            
    //         steps {
    //              input message: "发布或停止"
    //              ansiblePlaybook( 
    //             	installation: 'ansible2.9.25', 
    //             	inventory: "${env.WORKSPACE}/hosts", 
    //             	limit: '8.142.43.112,8.142.71.75', 
    //             	playbook: "${env.WORKSPACE}/playbook.yaml",
    //             	extraVars: [
    //             		project_name:'v7-apipost-fe',
    //             		deploy_path:'/data/Application/',
    //             		WORKSPACE:"${env.WORKSPACE}/build",
    //                     backfile: 'true'
    //             	])
    //         }
    // }
    stage('版本标签') {
        when {
                branch 'master1'
            }
            steps {
            script{
                    def GIT_TAG = new Date().format("yyyy-MM-dd_HH-mm-ss");
                   // git branch: "${env.GIT_BRANCH}", credentialsId: 'bcb57094-5e19-4f14-9c15-0046ed8a91fe', url: "ssh://git@${git}"
                    sh """
                        git config --system user.email "jay@apipost.cn"
                        git config --system user.name "guobaobao"
                        git checkout "${env.BRANCH_NAME}"
                        git tag -a ${GIT_TAG} -m 'jenkins'
                        git config --system push.default simple
                       
                       git push origin --tags
                    """
            }
        }
    }
               
    }
    post {

        success {
            script {
             if (WEBHOOK_REF =~ /(refs\/heads\/test|test|master|refs\/heads\/master|rc|refs\/heads\/rc|refs\/heads\/v7-beta|v7-beta)/)  {
            sh """
                "$scriptPath"  "【发布成功】完成发布" "green"  $WEBHOOK_USER_NAME  $JOB_NAME  $BUILD_NUMBER   "$BUILDVERSION"    $BUILD_URL   "$feishuWb"
            """
             }
            }
        }
        failure {
            script {
             if (WEBHOOK_REF =~ /(refs\/heads\/test|test|master|refs\/heads\/master|rc|refs\/heads\/rc|refs\/heads\/v7-beta|v7-beta)/)  {
            sh """
                "$scriptPath"  "【发布失败】发布失败" "red"  $WEBHOOK_USER_NAME  $JOB_NAME  $BUILD_NUMBER   "$BUILDVERSION"    $BUILD_URL   "$feishuWb"
            """
                         }
            }
        }
        aborted {
             script {
             if (WEBHOOK_REF =~ /(refs\/heads\/test|test|master|refs\/heads\/master|rc|refs\/heads\/rc|refs\/heads\/v7-beta|v7-beta)/)  {           
            sh """
                "$scriptPath"  "【发布失败】终止发布" "purple"  $WEBHOOK_USER_NAME  $JOB_NAME  $BUILD_NUMBER   "$BUILDVERSION"    $BUILD_URL   "$feishuWb"
            """  
                         }
            }          
        }
        unstable {
            script {
             if (WEBHOOK_REF =~ /(refs\/heads\/test|test|master|refs\/heads\/master|rc|refs\/heads\/rc|refs\/heads\/v7-beta|v7-beta)/)  {
            sh """
                "$scriptPath"  "【发布失败】发布不稳定" "red"  $WEBHOOK_USER_NAME  $JOB_NAME  $BUILD_NUMBER   "$BUILDVERSION"    $BUILD_URL   "$feishuWb"
            """  
                         }
            }              
        }
    }

    
}
