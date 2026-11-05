// Wording follows MyBook/个人简历.md verbatim; schools, dates and GPA come from 林煜轩CV.pdf.
export const resumePdf = "/files/yuxuan-lin-cv.pdf";

export const selfReview = [
  "电子与计算机工程专业，AI能力出众，拥有多段开发经历，能够从软硬件系统角度理解产品与应用需求。",
  "留学背景，具备了跨文化沟通与协作经验。",
  "实习期间对接欧洲本地运营，支持B端营销方案开发与落地；通过课程助教和产品路演，积累了技术讲解、问题答疑与展示经验。渴望将工程分析能力与业务理解结合。",
];

export const education = [
  {
    school: "哥伦比亚大学 (Columbia University)",
    college: "工程与应用科学学院",
    degree: "计算机工程硕士",
    period: "2025 年 8 月 — 2027 年 2 月",
    gpa: "GPA: 4.0 / 4.0",
    honor: {
      title: "MS EE/CE Honors Students 2026",
      url: "https://www.ee.columbia.edu/ms-ee-honors-program",
      text: "To recognize MS EE students with an exceptional academic record, active EE MS students with a GPA in the top 10% of the class are included in the MS Honors program.",
    },
    courses: [
      "IOT - INTELLIG & CONNECTED SYS",
      "FORMAL VERIF HW SW SYSTEM",
      "COMPUTER NETWORKS",
      "COMPUTER VISION II: LEARN",
      "DATA CENTER PROCESSING",
      "MODELING & PERFORMANCE EVALUATION",
      "LLM BASED GENERATIVE AI",
      "FUND-LARGE-SCALE DISTRIBUTED SYSTEMS",
    ],
  },
  {
    school: "浙江大学",
    college: "浙江大学伊利诺伊大学厄巴纳香槟校区联合学院",
    degree: "电子与计算机工程学士｜ZJU-UIUC 双学位项目",
    period: "2021 年 9 月 — 2025 年 7 月",
    gpa: "GPA: 3.8 / 4.0",
    thesis: "基于生成式模型的图像重建",
    teaching:
      "担任课程助教（离散数学），组织教学活动，课程材料策划，学生问题跟进、整理与反馈",
    courses: [
      "Introduction to Data Mining",
      "Senior Thesis",
      "Introduction to Robotics",
      "Senior Design Project Lab",
      "Digital Systems Laboratory",
      "Digital Signal Processing",
      "Introduction to Algorithms & Models of Computation",
      "Machine Learning",
      "Applied Parallel Programming",
      "Artificial Intelligence",
      "Communication Networks",
      "Computer Systems Engineering",
      "Game Development",
      "Probability with Engrg Applic",
      "Database Systems",
      "Analog Signal Processing",
      "Data Structures",
      "Linear Algebra with Computational Applications",
      "Basic Discrete Mathematics",
      "Computer Systems & Programming",
      "Introduction to Computing",
      "Intro to Computing: Engrg&Sci",
      "Introduction to Electronics",
    ],
  },
];

export const experience = [
  {
    company: "阿里国际数字商业集团",
    role: "AI应用开发工程师",
    team: "招商（B端营销）",
    period: "2026年5月 — 2026年8月",
    points: [
      [
        "跨域沟通支持",
        "对接欧洲当地运营, 深入电商平台客户业务场景，主动挖掘痛点，产出技术方案",
      ],
      [
        "B端商家提效引流",
        "负责商家智能营销助手全流程开发，设计并落地智能化圈品定价提报能力，支撑每日千万级SKU自动化提效；基于商家画像构建活动页分流策略，针对性推荐营销玩法，目标商家点击转化率51.5%，达成业务目标",
      ],
      [
        "解决方案复盘沉淀（Agent Loop 样板间）",
        "基于内部平台实现一站式AI Coding样板间。主导集成测试、活动创建与报名Skill开发，打通端到端自动化测试流程，实现开发全链路闭环，整体提效约30%",
      ],
      [
        "阿里国际黑客松",
        "48小时极限搭建对话式Agent，实现情感驱动的电商入口创新；项目进入复赛（100/1388），设计物料并进行会场展示与产品路演，获人气TOP25",
      ],
    ],
  },
  {
    company: "海康威视数字技术股份有限公司",
    role: "嵌入式软件开发工程师",
    team: "机器人系统",
    unit: "萤石网络 IoT产品五部 软件技术部",
    period: "2024年7月 — 2024年9月",
    points: [
      ["实地部署交付与质量把控", "深入工厂实地收集产品数据，洞察技改需求"],
      [
        "嵌入式开发",
        "在Linux OS上开发并集成商用清洁机器人主控系统核心模块，在FreeRTOS上开发传感器控制与数据采集逻辑，保障单片机的精确控制与实时运行",
      ],
    ],
  },
];

export const research = {
  title: "Bayesian PET Reconstruction with Learned Normalizing Flow Priors",
  venue: "IEEE International Symposium on Biomedical Imaging (ISBI) 2026",
  role: "二作",
  date: "08-11 April 2026",
  url: "https://ieeexplore.ieee.org/abstract/document/11515791",
  text: "对于医学影像重建问题，使用Flow Matching / Normalizing Flows模型对示踪剂活度的先验与后验分布进行建模，在Slurm集群中完成多卡并行加速训练，实现了可靠的不确定性量化与高质量重建",
};

export const projects = [
  {
    title: "PACC：能耗感知的分布式训练通信模拟框架",
    role: "分布式训练及Profiling框架开发",
    period: "2025 年秋季",
    repo: "https://github.com/awelynx/PACC",
    page: "/work/pacc/",
    points: [
      "4人团队协作，设计并搭建基于真实推理/训练执行轨迹的端到端仿真工作流，支持对大规模深度学习系统进行可复用的能耗感知与性能分析。",
      "实现多GPU分布式微调（FSDP + LoRA）场景下的集体通信与内核级执行事件采集以及格式转化，涵盖多个主流模型。",
    ],
  },
  {
    title: "FinGOAT：面向金融的图编排智能交易助手",
    role: "AI应用开发",
    repo: "https://github.com/awelynx/FinGOAT",
    page: "/work/fingoat/",
    points: [
      "构建了一个智能美股决策网页应用，解决多智能体串行延迟，决策透明度与易用性问题。",
      "采用Gin网关+FastAPI推理服务架构，PostgreSQL（GORM）持久化推理链路与决策结果；通过Docker容器化核心微服务，实现全栈快速部署。",
      "基于LangGraph实现多Agent并行执行与依赖控制，多 Agent 场景下较串行流程端到端决策延迟降低约70%，并支持多API /本地Ollama / OpenClaw推理选择。",
    ],
  },
  {
    title: "基于FPGA的交互式游戏系统",
    period: "2025 年春季",
    points: [
      "基于FPGA开发植物大战僵尸游戏；集成硬件模块，Nios II软核处理器及外设，开展ModelSim仿真与系统验证，实现显示、输入及控制逻辑的软硬件协同",
    ],
  },
  {
    title: "CUDA-LeNet5：GPU并行加速卷积核优化",
    role: "CUDA算子开发",
    period: "2024 年秋季",
    repo: "https://github.com/awelynx/LeNet-CUDA-ECE408",
    page: "/work/cuda-lenet/",
    points: [
      "使用CUDA优化LeNet-5卷积层——采用Streams、Tensor Cores、共享/常量内存分块、量化、循环展开等，优化吞吐量；较CPU朴素实现提速 27,909 倍，较无优化并行基线提升36%。",
    ],
  },
  {
    title: "LOS：轻量级类Linux操作系统",
    role: "操作系统内核开发",
    period: "2024 年春季",
    repo: "https://github.com/awelynx/Linux-OS-Kernel-ECE391/tree/main/mp3",
    page: "/work/linux-kernel/",
    points: [
      "4人团队协作，使用C与x86汇编构建类 Linux OS内核。",
      "开发虚拟内存、文件系统、终端显示、中断机制、系统调用、异常处理与设备驱动（键盘、RTC、PIT）等模块，完成内核与用户态隔离下的多进程切换、多终端管理与调度机制。",
    ],
  },
  {
    title: "基于生成式流模型的医学影像重建",
    repo: "https://github.com/awelynx/DeepMed-Imaging-Reconstruction",
    page: "/work/probabilistic-imaging/",
    points: [
      "将 PET（正电子发射断层扫描）重建问题表述为贝叶斯推理问题，实现了深度概率成像流程，提高了重建精度，并为临床诊断提供了关键的不确定性估计。",
      "应用归一化流（RealNVP、Glow）模型来建模示踪剂活性的后验分布，并通过多 GPU 并行化进行训练扩展。",
    ],
  },
  {
    title: "基于生成式AI的3D模型设计插件",
    role: "浙江大学 ICI Lab · 科研助理",
    repo: "https://github.com/awelynx/AID3-Blender-Plugin",
    page: "/work/aid3/",
    points: [
      "为Blender开发生成式AI插件，实现3D设计流程自动化——设计原型管理、分割与高斯-网格转换。",
      "构建基于Transformer/Diffusion模型的文本到3D模型生成系统，结合高斯喷溅与网格渲染技术，简化建模过程；部署基于Flask的后台服务，用于采集用户交互行为并提供实时3D生成服务。",
    ],
  },
];

export const activities = [
  {
    title: "中金财富2022暑期财商训练营",
    text: "通过金融课程培训，学习金融市场基础知识与资产配置方法；参与资产配置项目，开展配置方案设计与分析，并完成项目路演，提升金融知识应用、团队协作及方案表达能力。",
  },
];
