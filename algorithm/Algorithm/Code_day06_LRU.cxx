class Solution
{
public:
    /**
     * lru design
     * @param operators int整型vector<vector<>> the ops
     * @param k int整型 the k
     * @return int整型vector
     */
    vector<int> LRU(vector<vector<int> >& operators, int k) {
        vector<int> ret = {};
        vector<int> values = {};
        vector<int> keys = {};
        for (auto opt = operators.begin(); opt != operators.end(); ++opt)
        {
            if ((*opt)[0] == 1)
            {
                set((*opt)[1], (*opt)[2], keys, values, k);
            }
            else
            {
                ret.push_back(get((*opt)[1], keys, values));
            }
        }
        return ret;
    }
     
    void set(int &key, int &value, vector<int>&keys, vector<int> &values, int &k)
    {
        if (k == keys.size())
        {
            values.erase(values.begin());
            keys.erase(keys.begin());
        }
        keys.push_back(key); // 感觉这里的set有问题，如果对于已经有的key，不应该是先remove然后push_back吗
        values.push_back(value);
    }
     
    int get(int &key, vector<int> &keys, vector<int>& values)
    {
        auto key_it = find(keys.begin(), keys.end(), key);
        if (key_it == keys.end()) return -1;
        int r = values[key_it-keys.begin()];
        keys.erase(key_it);
        keys.push_back(key);
        values.erase(values.begin() + (key_it - keys.begin()));
        values.push_back(r);
        return r;
    }
};