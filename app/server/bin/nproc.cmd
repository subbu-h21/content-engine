@echo off
rem Remotion asks `nproc` (a Linux command) for the CPU count on every Studio request and doesn't remember a
rem failure: without an nproc on PATH each request waits ~1 s for cmd.exe to fail and Studio never catches up.
rem The engine puts this folder first on PATH for everything it starts.
echo %NUMBER_OF_PROCESSORS%
