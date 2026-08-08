import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'

import { runTypeCheck } from './runTypeCheck'

describe('runTypeCheck', () => {
  let dir: string

  beforeEach(() => {
    dir = mkdtempSync(path.join(tmpdir(), 'next-run-type-check-'))
    mkdirSync(path.join(dir, 'src'))
    writeFileSync(
      path.join(dir, 'tsconfig.json'),
      JSON.stringify({
        compilerOptions: { strict: true, noEmit: true, skipLibCheck: true },
        include: ['src'],
      })
    )
  })

  afterEach(() => {
    rmSync(dir, { recursive: true, force: true })
  })

  it('reports no warnings for a project that produces none', async () => {
    writeFileSync(
      path.join(dir, 'src/index.ts'),
      'export const answer: number = 42\n'
    )

    const result = await runTypeCheck(
      require('typescript'),
      dir,
      path.join(dir, '.next'),
      path.join(dir, 'tsconfig.json')
    )

    expect(result.warnings ?? []).toEqual([])
    expect(result.hasWarnings).toBe(false)
  })
})
