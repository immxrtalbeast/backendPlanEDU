# UNUSED

from langchain_core.prompts import PromptTemplate
def template():
    template = '''Answer the following questions as best you can. You have access to the following tools:

    {tools}

    Use the following format:

    Question: the input question you must answer
    Thought: you should always think about what to do
    Action: the action to take, should be one of [{tool_names}]
    Action Input: the input to the action
    Observation: the result of the action
    ... (this Thought/Action/Action Input/Observation can repeat N times)
    Thought: I now know the final answer
    Final Answer: the final answer to the original input question, including references with titles, links, and descriptions.

    The references should be formatted as follows:
    - Title: [Source Title]
      Link: [Source URL]
      Description: [Brief description of the source]

    Begin!

    Question: {input}
    Thought:{agent_scratchpad}'''
    return PromptTemplate.from_template(template) 
