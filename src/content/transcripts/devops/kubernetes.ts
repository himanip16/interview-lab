// src/content/transcripts/devops/kubernetes-deployment-fundamentals.ts

import { Difficulty } from "@prisma/client";
import { TranscriptData } from "@/features/library/types/transcript";
import { TranscriptEntry } from "../types";

const transcript: TranscriptData = {
  metadata: {
    title: "Deployment Fundamentals: Kubernetes Basics",
    difficulty: Difficulty.MEDIUM,
    duration: 30,
    template: "DevOps",
    category: "DevOps",
  },

  messages: [
    {
      id: "1",
      role: "interviewer",
      elapsedSeconds: 0,
      content: [
        {
          type: "text",
          value:
            "You've got a service running as a single Docker container on one VM. Why would you move it to Kubernetes at all?",
        },
      ],
    },
    {
      id: "2",
      role: "candidate",
      elapsedSeconds: 15,
      content: [
        {
          type: "text",
          value:
            "Depends on the actual problem. If it's about surviving a crash, self-healing and multiple replicas across nodes gets you that. If it's about scaling with load, Kubernetes gives horizontal scaling and load distribution built in. If it's just one low-traffic service with no HA requirement, Kubernetes might be overkill — the orchestration overhead isn't free.",
        },
        {
          id: "highlight-not-default-yes",
          type: "highlight",
          status: "strong",
          value: "Doesn't treat Kubernetes as automatically the right answer",
          explanation:
            "Candidate ties the tool to the actual requirement instead of assuming K8s is always the upgrade — pushback-resistant framing right from the start.",
        },
      ],
    },
    {
      id: "3",
      role: "interviewer",
      elapsedSeconds: 35,
      content: [
        {
          type: "text",
          value: "Say it does need HA and scaling. What's the smallest deployable unit in Kubernetes?",
        },
      ],
    },
    {
      id: "4",
      role: "candidate",
      elapsedSeconds: 50,
      content: [
        {
          type: "text",
          value:
            "A Pod — not a container. A Pod can hold one or more containers that share network namespace and storage volumes, always scheduled together on the same node.",
        },
      ],
    },
    {
      id: "5",
      role: "interviewer",
      elapsedSeconds: 65,
      content: [
        {
          type: "text",
          value: "Why would I ever want more than one container in a Pod?",
        },
      ],
    },
    {
      id: "6",
      role: "candidate",
      elapsedSeconds: 82,
      content: [
        {
          type: "text",
          value:
            "Sidecar pattern — a helper container tightly coupled to the main one. Like a log-shipping container that tails the app's log volume and forwards it out, or a service-mesh proxy like Envoy handling network traffic for the app container. They need to live and die together and share localhost networking, which is exactly what a Pod gives you.",
        },
      ],
    },
    {
      id: "7",
      role: "interviewer",
      elapsedSeconds: 100,
      content: [
        {
          type: "text",
          value:
            "I create a bare Pod directly — no Deployment. It crashes. What happens?",
        },
      ],
    },
    {
      id: "8",
      role: "candidate",
      elapsedSeconds: 118,
      content: [
        {
          type: "text",
          value:
            "It's gone. A bare Pod isn't managed by any controller, so nothing notices it died and nothing recreates it. That's exactly why you almost never create Pods directly in practice — you go through a Deployment, which owns a ReplicaSet, which is the thing that actually watches the desired replica count and recreates Pods when they disappear.",
        },
        {
          id: "highlight-bare-pod-no-selfheal",
          type: "highlight",
          status: "strong",
          value: "Explains that self-healing comes from the controller, not the Pod itself",
          explanation:
            "A common misconception is that Kubernetes 'just restarts things' magically. Candidate correctly attributes recovery to the ReplicaSet controller reconciling against a Deployment's desired state.",
        },
      ],
    },
    {
      id: "9",
      role: "interviewer",
      elapsedSeconds: 140,
      content: [
        {
          type: "text",
          value:
            "Give me the Deployment YAML for 3 replicas of an nginx image, then explain each field.",
        },
      ],
    },
    {
      id: "10",
      role: "candidate",
      elapsedSeconds: 175,
      content: [
        {
          type: "code",
          language: "yaml",
          value:
            "apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: web-app\nspec:\n  replicas: 3\n  selector:\n    matchLabels:\n      app: web-app\n  template:\n    metadata:\n      labels:\n        app: web-app\n    spec:\n      containers:\n        - name: nginx\n          image: nginx:1.25\n          ports:\n            - containerPort: 80\n          readinessProbe:\n            httpGet:\n              path: /healthz\n              port: 80\n            initialDelaySeconds: 5\n          livenessProbe:\n            httpGet:\n              path: /healthz\n              port: 80\n            periodSeconds: 10",
        },
        {
          type: "text",
          value:
            "`selector.matchLabels` is how the Deployment finds which Pods belong to it — it has to match `template.metadata.labels` exactly, or the Deployment can't track its own Pods. `replicas: 3` is the desired state the ReplicaSet reconciles toward.",
        },
      ],
    },
    {
      id: "11",
      role: "interviewer",
      elapsedSeconds: 200,
      content: [
        {
          type: "text",
          value: "What's the actual difference between readinessProbe and livenessProbe?",
        },
      ],
    },
    {
      id: "12",
      role: "candidate",
      elapsedSeconds: 220,
      content: [
        {
          type: "text",
          value:
            "livenessProbe answers 'is this container alive, or should it be killed and restarted' — fails it, Kubernetes kills the container. readinessProbe answers 'is this container ready to accept traffic right now' — fails it, the Pod gets pulled from the Service's endpoint list, but the container isn't killed. It could be temporarily busy, warming a cache, waiting on a dependency — restarting it wouldn't help and would make things worse.",
        },
        {
          id: "highlight-liveness-vs-readiness",
          type: "highlight",
          status: "strong",
          value: "Correctly separates 'kill and restart' from 'pull from traffic without killing'",
          explanation:
            "This distinction is frequently blurred by candidates. Getting it precise — readiness failure doesn't restart the container — is a real signal of hands-on Kubernetes experience.",
        },
      ],
    },
    {
      id: "13",
      role: "interviewer",
      elapsedSeconds: 245,
      content: [
        {
          type: "text",
          value:
            "You set livenessProbe with too aggressive a timeout on a container doing heavy startup work. What actually happens in production?",
        },
      ],
    },
    {
      id: "14",
      role: "candidate",
      elapsedSeconds: 268,
      content: [
        {
          type: "text",
          value:
            "Crash loop. The container is still legitimately starting up, misses the liveness deadline, gets killed, restarts, starts the same slow init again, misses the deadline again — CrashLoopBackOff. That's exactly what `initialDelaySeconds` and `startupProbe` exist to prevent — give slow-starting containers a grace period before liveness checks even begin.",
        },
        {
          id: "highlight-crashloop-cause",
          type: "highlight",
          status: "strong",
          value: "Traces a misconfigured probe timeout to CrashLoopBackOff specifically",
          explanation:
            "Interviewer pushes on a misconfiguration scenario; candidate names the exact resulting failure state and the specific config fields meant to prevent it, rather than a vague 'it would restart a lot'.",
        },
      ],
    },
    {
      id: "15",
      role: "interviewer",
      elapsedSeconds: 290,
      content: [
        {
          type: "text",
          value: "How do other Pods actually find this Deployment's Pods? IPs change on every restart.",
        },
      ],
    },
    {
      id: "16",
      role: "candidate",
      elapsedSeconds: 315,
      content: [
        {
          type: "text",
          value:
            "A Service. It's a stable virtual IP and DNS name in front of a set of Pods matched by label selector — same selector mechanism as the Deployment uses. Kubernetes updates the Service's endpoint list automatically as Pods come and go, so callers never talk to a Pod IP directly, they talk to the Service name and it stays consistent even as backing Pods churn.",
        },
      ],
    },
    {
      id: "17",
      role: "interviewer",
      elapsedSeconds: 335,
      content: [
        {
          type: "text",
          value: "ClusterIP, NodePort, LoadBalancer — when do you use each, concretely?",
        },
      ],
    },
    {
      id: "18",
      role: "candidate",
      elapsedSeconds: 365,
      content: [
        {
          type: "text",
          value:
            "ClusterIP is internal-only — default choice for a backend service that only other things inside the cluster call, like an internal API. NodePort exposes the service on a static port on every node's IP — mostly a building block or for quick dev/debug access, not something I'd expose to the public internet directly. LoadBalancer provisions an actual external load balancer from the cloud provider — AWS ELB, GCP's LB — and is what you'd use for a public-facing service, though in practice a lot of setups put an Ingress in front of ClusterIP services instead, to avoid provisioning a separate cloud LB per service.",
        },
        {
          id: "highlight-service-types",
          type: "highlight",
          status: "strong",
          value: "Gives concrete use cases per Service type, and flags Ingress as the common alternative",
          explanation:
            "Instead of just defining the three types, candidate explains why one LoadBalancer-per-service is often avoided in practice — a real operational consideration.",
        },
      ],
    },
    {
      id: "19",
      role: "interviewer",
      elapsedSeconds: 390,
      content: [
        {
          type: "text",
          value:
            "You need to roll out v2 of the image with zero downtime. What does the Deployment do by default, and what can go wrong?",
        },
      ],
    },
    {
      id: "20",
      role: "candidate",
      elapsedSeconds: 420,
      content: [
        {
          type: "text",
          value:
            "By default it's a RollingUpdate — it doesn't kill all v1 Pods and start v2, it gradually replaces them, starting new v2 Pods and only removing v1 Pods as v2 ones become ready, controlled by `maxSurge` and `maxUnavailable`. What can go wrong: if v2 has a bug that only shows up under real traffic, and the readinessProbe still reports it as ready because the probe endpoint is too shallow — like just checking the process is up, not that dependencies are reachable — the rollout will happily replace all healthy v1 Pods with broken v2 Pods, because Kubernetes trusts the readiness signal you gave it.",
        },
        {
          id: "highlight-shallow-probe-risk",
          type: "highlight",
          status: "strong",
          value: "Identifies that a shallow readiness probe can let a broken rollout complete fully",
          explanation:
            "Real production risk: RollingUpdate's safety is only as good as the readiness signal. Candidate connects the rollout mechanics to the probe-quality problem discussed earlier instead of treating them as separate topics.",
        },
      ],
    },
    {
      id: "21",
      role: "interviewer",
      elapsedSeconds: 445,
      content: [
        {
          type: "text",
          value: "So how do you actually guard against that?",
        },
      ],
    },
    {
      id: "22",
      role: "candidate",
      elapsedSeconds: 465,
      content: [
        {
          type: "text",
          value:
            "Make the readiness probe check something meaningful — actual dependency connectivity, not just 'process is alive'. And set `maxUnavailable` conservatively so you're not replacing everything at once, plus watch error rates during rollout and be ready to `kubectl rollout undo` — Deployments keep revision history specifically for that. Ideally that's automated as part of the rollout process, not a human watching a dashboard, but the manual path exists as a fallback.",
        },
      ],
    },
    {
      id: "23",
      role: "interviewer",
      elapsedSeconds: 490,
      content: [
        {
          type: "text",
          value: "Traffic doubles unexpectedly. Deployment has 3 replicas, fixed. What now?",
        },
      ],
    },
    {
      id: "24",
      role: "candidate",
      elapsedSeconds: 512,
      content: [
        {
          type: "text",
          value:
            "Manually, `kubectl scale deployment web-app --replicas=6`. But for actual production traffic spikes I wouldn't want a human in that loop — a HorizontalPodAutoscaler watches a metric, usually CPU or memory utilization, and adjusts replica count automatically within a min/max range I set. It only helps if there's room on the underlying nodes though — if the cluster itself is out of capacity, the Pods stay Pending until the node pool scales too, usually via a Cluster Autoscaler working alongside it.",
        },
        {
          id: "highlight-hpa-plus-node-capacity",
          type: "highlight",
          status: "strong",
          value: "Notes HPA is capped by underlying node capacity, not just Pod-level scaling",
          explanation:
            "A subtlety often missed: scaling Pods doesn't help if there's no room on nodes to schedule them. Candidate names the second-layer autoscaler needed to actually add capacity.",
        },
      ],
    },
    {
      id: "25",
      role: "interviewer",
      elapsedSeconds: 535,
      content: [
        {
          type: "text",
          value: "Last thing — where does config and secret data live? Don't say 'in the image'.",
        },
      ],
    },
    {
      id: "26",
      role: "candidate",
      elapsedSeconds: 555,
      content: [
        {
          type: "text",
          value:
            "ConfigMap for non-sensitive config, Secret for sensitive values — API keys, credentials. Both get mounted into the Pod as environment variables or as files on a volume, so the same image can run in different environments just by changing what's mounted, no rebuild. One caveat — a base Secret in Kubernetes is only base64-encoded, not encrypted, at the etcd storage layer by default. For real secrets management I'd want encryption at rest enabled on etcd, or use an external secrets manager like Vault or AWS Secrets Manager integrated in, rather than trusting the default Secret object alone.",
        },
        {
          id: "highlight-secrets-caveat",
          type: "highlight",
          status: "strong",
          value: "Flags that Kubernetes Secrets are base64-encoded, not encrypted, by default",
          explanation:
            "A commonly-missed operational detail — treating Secret objects as sufficiently secure by name alone is a real production mistake. Candidate names the actual gap and the fix.",
        },
      ],
    },
    {
      id: "27",
      role: "takeaway",
      elapsedSeconds: 580,
      content: [
        {
          type: "text",
          value:
            "Takeaway: this session tests whether the mental model is actually correct, not just vocabulary. Several precise distinctions matter here: self-healing comes from the ReplicaSet controller reconciling desired state, not from the Pod itself — a bare Pod that crashes stays dead. livenessProbe kills and restarts; readinessProbe only pulls from traffic, it doesn't restart anything — conflating these is a common and consequential mistake. The riskiest thread running through the conversation is the readiness probe: a shallow probe doesn't just cause slow detection, it can let a fully broken RollingUpdate complete undetected, replacing every healthy Pod with a broken one. HPA is correctly bounded by underlying node capacity, requiring a Cluster Autoscaler to actually add room. And the Secrets caveat — base64 is not encryption — is exactly the kind of default-trust mistake that causes real incidents. Strong session because each mechanism is tied to a concrete failure scenario instead of being defined in isolation.",
        },
      ],
    },
  ],
};

const kubernetesDeploymentFundamentals: TranscriptEntry = {
  summary: {
    id: 13,

    slug: "kubernetes-deployment-fundamentals",
    title: "Deployment Fundamentals: Kubernetes Basics",
    category: "devops",
    difficulty: Difficulty.MEDIUM,
    duration: 30,
    tags: [
      "Kubernetes",
      "Deployment",
      "DevOps",
      "Rolling Update",
      "Autoscaling",
      "Health Checks",
      "Secrets",
    ],
    description:
      "Deployment fundamentals interview covering Kubernetes basics with an interviewer that pushes on why, not just what. Covers Pod vs container and the sidecar pattern, why bare Pods don't self-heal (recovery comes from the ReplicaSet controller, not the Pod), a full Deployment YAML walkthrough with readiness/liveness probes, the precise distinction between liveness (kill and restart) and readiness (pull from traffic without killing), tracing a misconfigured liveness timeout to CrashLoopBackOff, Service types (ClusterIP/NodePort/LoadBalancer) with concrete use cases and the common Ingress alternative, how a shallow readiness probe can let a fully broken RollingUpdate complete undetected, HorizontalPodAutoscaler bounded by underlying node capacity and the Cluster Autoscaler that addresses it, and a caveat that Kubernetes Secrets are base64-encoded rather than encrypted by default. Closes on tying each mechanism to a concrete failure scenario rather than definitions in isolation.",
  },

  transcript,
};

export default kubernetesDeploymentFundamentals;