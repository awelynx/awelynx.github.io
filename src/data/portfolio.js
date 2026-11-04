// Facts and wording follow the original resume (src/pages/resume.md at c6b57ce).
export const profile = {
  name: "Yuxuan Lin",
  chineseName: "林煜轩",
  handle: "lynxarv",
  focus: "AI 应用 · 系统工程 · 生成式模型",
  intro:
    "我关注如何让 AI 模型进入可用、可理解、可扩展的真实系统。工程经历覆盖多智能体应用、分布式训练、CUDA 优化与嵌入式机器人。",
  description:
    "林煜轩 Yuxuan Lin，Columbia 计算机工程硕士。探索 AI 应用、分布式系统与生成式模型。项目、研究和技术手记。",
  email: "yl6061@columbia.edu",
  github: "https://github.com/lynxarv",
  linkedin: "https://www.linkedin.com/in/yuxuan0/",
};

export const education = [
  {
    school: "Columbia University",
    degree: "M.S. in Computer Engineering",
    text: "预计 2027 年 2 月毕业。MS EE/CE Honors 2026。相关学习涵盖大规模分布式系统、数据中心处理、生成式 AI、计算机网络与计算机视觉。",
  },
  {
    school: "Zhejiang University × University of Illinois Urbana-Champaign",
    degree:
      "B.Eng. in Electronic & Computer Engineering，B.S. in Computer Engineering",
    text: "ZJU–UIUC 双学位项目。",
  },
];

export const experience = [
  {
    company: "Alibaba International",
    role: "AI 应用开发工程师",
    period: "2026.05 — 2026.08",
    team: "招商与 B 端营销",
    points: [
      "对接欧洲本地运营，结合商家业务场景产出技术方案。",
      "开发商家智能营销助手，涵盖智能圈品、定价与提报能力；根据个人实习记录，支撑每日千万级 SKU 自动化流程，目标商家点击转化率为 51.5%。",
      "基于内部平台构建 Agent Loop 样板间，开发集成测试、活动创建与报名 Skill，打通端到端测试流程；个人实习记录中的整体提效约为 30%。",
      "参与 48 小时黑客松，搭建情感驱动的电商对话 Agent，进入复赛（100 / 1388），获人气 TOP 25。",
    ],
  },
  {
    company: "Hikvision / EZVIZ",
    role: "嵌入式软件开发",
    period: "2024.07 — 2024.09",
    team: "机器人系统",
    points: [
      "在 Linux 上开发商用清洁机器人主控系统模块，在 FreeRTOS 上实现传感器控制与数据采集逻辑，并参与工厂实地数据收集与部署交付。",
    ],
  },
  {
    company: "ZJU–UIUC",
    role: "离散数学课程助教",
    period: "2024.09 — 2025.01",
    points: [
      "组织教学与答疑活动，参与课程材料策划、作业与考试批改，整理并跟进学生问题。",
    ],
  },
];

export const publication = {
  title: "Bayesian PET Reconstruction with Learned Normalizing Flow Priors",
  venue: "IEEE ISBI 2026",
  role: "第二作者",
  date: "2026 年 4 月 8–11 日",
  authors: ["Hengjia Ran", "Yuxuan Lin", "Huafeng Liu", "Bo Zhao"],
  text: "研究基于生成式流模型的 PET 重建、后验分布建模与不确定性量化，在 Slurm 集群中进行多 GPU 并行训练。",
  paper: "https://ieeexplore.ieee.org/abstract/document/11515791",
  code: "https://github.com/lynxarv/DeepMed-Imaging-Reconstruction",
  project: "/work/probabilistic-imaging/",
};

export const otherProjects = [
  "FPGA 交互式游戏系统 — 软硬件协同实现显示、输入与游戏控制，使用 Nios II、SystemVerilog 与 ModelSim。",
];

export const tools = [
  [
    "Languages",
    "C / C++、Python、Go、TypeScript、SQL、x86 Assembly、SystemVerilog",
  ],
  ["AI & systems", "PyTorch、CUDA、LangGraph、FSDP、LoRA、Linux、FreeRTOS"],
  ["Applications", "React、Gin、FastAPI、Flask、PostgreSQL、Docker"],
];

// Display order. Case-study text for the first three is the original project data.
export const projects = [
  {
    slug: "probabilistic-imaging",
    title: "Probabilistic imaging",
    category: "生成式研究",
    year: "2024 — 2025",
    subtitle: "重建图像，也理解不确定性。",
    description:
      "用生成式流模型研究 PET 图像重建，将先验与后验建模带入医学成像。相关成果发表于 IEEE ISBI 2026。",
    tags: ["Normalizing Flows", "Bayesian inference", "Multi-GPU"],
    image: "imaging",
    imageAlt: "PET 重建结果对比：OSEM、FBP、真值与 64 个样本的后验均值",
    repo: "https://github.com/lynxarv/DeepMed-Imaging-Reconstruction",
    paper: "https://ieeexplore.ieee.org/abstract/document/11515791",
    context:
      "医学图像重建不仅关心一张清晰图像，也关心估计是否可靠。将 PET 重建表述为贝叶斯推理问题，可以在重建结果之外进一步研究后验分布与不确定性。",
    decisions: [
      [
        "Probabilistic formulation",
        "围绕示踪剂活度的先验与后验分布建立深度概率成像流程。",
      ],
      [
        "Learned flow priors",
        "研究 RealNVP、Glow 等归一化流模型在医学图像重建中的使用。",
      ],
      [
        "Scalable experiments",
        "在 Slurm 集群中进行多 GPU 并行训练，支持重建质量与不确定性量化实验。",
      ],
    ],
    outcome:
      "论文 Bayesian PET Reconstruction with Learned Normalizing Flow Priors 发表于 IEEE ISBI 2026（2026 年 4 月 8–11 日）。作者：Hengjia Ran、Yuxuan Lin、Huafeng Liu、Bo Zhao；本人为第二作者。",
    related: "/docs/notes/algo/flow-based-model",
  },
  {
    slug: "fingoat",
    title: "FinGOAT",
    category: "多智能体系统",
    year: "2025 — 2026",
    subtitle: "把复杂决策，变成可追溯的推理。",
    description:
      "面向美股研究的图编排多智能体应用。从数据到观点，让并行推理、依赖控制和决策过程清晰可见。",
    tags: ["LangGraph", "Go / Gin", "FastAPI", "PostgreSQL"],
    metric: "≈70%",
    metricLabel: "相较串行流程的端到端延迟降低",
    image: "fingoat",
    imageAlt: "FinGOAT 的数据源、多智能体推理、网关与存储架构图",
    repo: "https://github.com/lynxarv/FinGOAT",
    context:
      "多智能体系统容易陷入串行等待：每一轮分析都依赖前一轮完成，用户也很难理解最终结论从何而来。FinGOAT 将依赖关系显式建模，让独立分析并行运行，并保留完整推理链路。",
    decisions: [
      [
        "Graph orchestration",
        "基于 LangGraph 定义多 Agent 的执行图与依赖控制，让可独立执行的分析并行运行。",
      ],
      [
        "Service boundaries",
        "使用 Gin 网关与 FastAPI 推理服务划分职责，PostgreSQL / GORM 持久化推理链路与决策结果，Docker 支持服务部署。",
      ],
      [
        "Inference flexibility",
        "支持多 API、本地 Ollama 与 OpenClaw 推理选择，在不同模型和运行环境之间保留切换空间。",
      ],
    ],
    outcome:
      "根据个人项目记录，多 Agent 场景下端到端决策延迟相较串行流程降低约 70%。该数字是项目内对比结果，具体表现取决于模型、依赖图和运行环境。",
    related: "/docs/notes/application/rag",
  },
  {
    slug: "pacc",
    title: "PACC",
    category: "分布式计算",
    year: "2025 — 2026",
    subtitle: "看见分布式训练背后的成本。",
    description:
      "能耗感知的分布式训练通信模拟框架。以真实执行轨迹，连接 GPU 内核、集体通信与系统性能分析。",
    tags: ["PyTorch", "FSDP + LoRA", "CUDA", "Profiling"],
    image: "pacc",
    imageAlt: "不同集体通信操作在各 GPU 频率下的功耗曲线",
    repo: "https://github.com/lynxarv/PACC",
    context:
      "训练性能无法只通过模型大小判断。通信、内核执行和并行策略共同决定系统的效率。PACC 使用真实工作负载轨迹构建可复用的分析工作流，帮助理解这些成本之间的关系。",
    decisions: [
      [
        "Real execution traces",
        "在多 GPU 分布式微调场景中采集执行轨迹，覆盖 FSDP 与 LoRA 工作负载。",
      ],
      [
        "Two levels of visibility",
        "同时收集集体通信与内核级执行事件，并完成格式转化，连接模型执行与仿真工具。",
      ],
      [
        "Reusable workflow",
        "在四人团队中共同设计端到端仿真流程，支持多个主流模型的能耗与性能分析。",
      ],
    ],
    outcome:
      "建立了由真实训练与推理轨迹驱动的工作流。我的主要工作是多 GPU 事件采集与格式转换；整体框架为团队协作成果。",
    related: "/docs/notes/training/distributed-training",
  },
  {
    slug: "cuda-lenet",
    title: "CUDA-LeNet5",
    category: "GPU 工程",
    year: "2024",
    subtitle: "从算子细节里，找到性能的空间。",
    description:
      "使用 Streams、Tensor Cores、共享内存与量化优化卷积内核；较无优化并行基线提升 36%（项目内测试）。",
    tags: ["CUDA", "Tensor Cores", "Profiling"],
    image: "cuda",
    imageAlt: "LeNet 卷积网络结构图",
    repo: "https://github.com/lynxarv/LeNet-CUDA-ECE408",
    context:
      "卷积性能不仅取决于并行线程数。访存方式、数据复用与硬件特性共同决定实际吞吐量。",
    decisions: [
      [
        "Memory & execution",
        "使用共享与常量内存分块、Streams、循环展开，减少访存与调度开销。",
      ],
      ["Hardware-aware kernels", "结合 Tensor Cores 与量化探索 GPU 计算能力。"],
    ],
    outcome:
      "根据项目记录，相较未优化的并行基线提升 36%。结果对应项目内的指定硬件、数据与测试设置。",
    related: "/docs/notes/hpc/cuda",
  },
  {
    slug: "linux-kernel",
    title: "LOS",
    category: "系统工程",
    year: "2024",
    subtitle: "从中断到进程，理解系统如何运转。",
    description:
      "使用 C 与 x86 汇编构建类 Linux 内核，涵盖虚拟内存、文件系统、系统调用、驱动与调度；四人团队协作。",
    tags: ["C", "x86 Assembly", "Virtual Memory"],
    image: "os",
    imageAlt: "LOS 物理内存与虚拟内存的映射关系",
    repo: "https://github.com/lynxarv/Linux-OS-Kernel-ECE391/tree/main/mp3",
    context:
      "从底层构建一个操作系统，能把教科书中的进程、内存与设备抽象变成相互配合的真实模块。",
    decisions: [
      ["Kernel fundamentals", "实现虚拟内存、文件系统、终端、中断与系统调用。"],
      [
        "Scheduling & devices",
        "实现键盘、RTC、PIT 等设备驱动，支持多进程切换与多终端调度。",
      ],
    ],
    outcome:
      "完成内核与用户态隔离下的多进程、多终端机制。项目由四人团队共同完成。",
    related: "/blog/2024/04/23/391os/",
  },
  {
    slug: "aid3",
    title: "AID3",
    category: "创意工具",
    year: "2024",
    subtitle: "让生成式模型进入设计工作流。",
    description:
      "为 Blender 开发生成式 AI 3D 设计插件，支持原型管理、分割与高斯 / 网格转换，结合 Transformer、Diffusion 与 Flask 后端探索文本到 3D 工作流。",
    tags: ["Blender", "Diffusion", "Flask"],
    repo: "https://github.com/lynxarv/AID3-Blender-Plugin",
    context:
      "生成一个 3D 结果只是起点。设计者还需要管理原型、调整几何，并把生成能力融入熟悉的工具。",
    decisions: [
      ["Tool integration", "在 Blender 中集成原型管理、分割与高斯—网格转换。"],
      [
        "Model & service",
        "结合 Transformer、Diffusion 与 Flask 服务，探索文本到 3D 的交互流程。",
      ],
    ],
    outcome:
      "在浙江大学 ICI Lab 科研助理阶段参与开发，将生成能力与设计工具连接。",
    related: "/docs/notes/algo/text2image",
  },
];
