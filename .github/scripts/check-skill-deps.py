#!/usr/bin/env python3
"""Verify .deps.json declarations across skills/ match package.json + pyproject.toml.

Each skill folder may contain a `.deps.json` declaring runtime deps:
  {"npm": ["@excalidraw/mermaid-to-excalidraw"], "pypi": ["pdf2image>=1.16"]}

If declared, those deps must be present in package.json / pyproject.toml.
Skills with no .deps.json are not validated (opt-in declaration).
"""
import json
import pathlib
import re
import sys
import tomllib


def _bare(spec: str) -> str:
    """Strip version + extras: 'pkg>=1.0[extra]' -> 'pkg'."""
    return re.split(r"[>=<~!\[\s]", spec, maxsplit=1)[0].strip()


declared = {"npm": set(), "pypi": set()}
declarations = {}  # name -> list of (kind, skill)

skills_root = pathlib.Path("skills")
if skills_root.exists():
    for deps_file in skills_root.rglob(".deps.json"):
        try:
            data = json.loads(deps_file.read_text())
        except json.JSONDecodeError as e:
            print(f"❌ Invalid JSON in {deps_file}: {e}")
            sys.exit(1)
        skill = deps_file.parent.name
        for kind in ("npm", "pypi"):
            for dep in data.get(kind, []):
                name = _bare(dep)
                declared[kind].add(name)
                declarations.setdefault((kind, name), []).append(skill)

current = {"npm": set(), "pypi": set()}
pkg_path = pathlib.Path("package.json")
if pkg_path.exists():
    pkg = json.loads(pkg_path.read_text())
    current["npm"] = set(pkg.get("dependencies", {}).keys())

pp_path = pathlib.Path("pyproject.toml")
if pp_path.exists():
    pp = tomllib.loads(pp_path.read_text())
    project = pp.get("project", {})
    for dep in project.get("dependencies", []):
        current["pypi"].add(_bare(dep))
    for group, deps in project.get("optional-dependencies", {}).items():
        for dep in deps:
            current["pypi"].add(_bare(dep))

missing = {k: declared[k] - current[k] for k in declared}

if any(missing.values()):
    print("❌ Skill-declared deps missing from package.json / pyproject.toml:")
    for kind in ("npm", "pypi"):
        for dep in sorted(missing[kind]):
            skills = ", ".join(declarations[(kind, dep)])
            print(f"  [{kind}] {dep}  (declared by: {skills})")
    print()
    print("Fix by adding the dep to the appropriate manifest, or removing the declaration.")
    sys.exit(1)

total = len(declared["npm"]) + len(declared["pypi"])
print(f"✅ All skill-declared deps present ({total} total declarations across {len(list(skills_root.rglob('.deps.json'))) if skills_root.exists() else 0} skill manifests).")
